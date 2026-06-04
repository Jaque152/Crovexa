'use server';
import { CheckoutPayload, CartItem, Checkout } from '@/types';
import { createClient } from '@supabase/supabase-js'; 
import { sendReceiptEmail } from '@/lib/mail';

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[CRÍTICO] Variable de entorno faltante: ${name}`);
    throw new Error(`Error de configuración en el servidor.`);
  }
  return value;
}

const getOctanoHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Posiciona Marketing/1.0',
  ...extraHeaders
});

async function safeOctanoFetch(url: string, options: RequestInit, stepName: string) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    
    if (!res.ok) console.warn(`⚠️ [Octano] Código HTTP ${res.status} en ${stepName}`);

    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Error ${res.status}: La ruta de pago es incorrecta o está bloqueada.`);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Falla de red en: ${stepName}.`);
  }
}

export async function processCheckout(formData: CheckoutPayload) {
  try {
    const { locale, contactInfo, billingInfo, cardInfo, items, total } = formData;
    
    const supabaseAdmin = createClient(
      requireEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnvVar('SUPABASE_SERVICE_ROLE_KEY')
    );

    const OCTANO_BASE_URL = requireEnvVar('OCTANO_BASE_URL');
    const OCTANO_EMAIL = requireEnvVar('OCTANO_EMAIL');
    const OCTANO_PASSWORD = requireEnvVar('OCTANO_PASSWORD');

    // 1. LOGIN
    const signinData = await safeOctanoFetch(`${OCTANO_BASE_URL}/signin`, {
      method: 'POST',
      headers: getOctanoHeaders(),
      body: JSON.stringify({ email: OCTANO_EMAIL, password: OCTANO_PASSWORD })
    }, 'Login Octano');

    if (!signinData.authToken) throw new Error("Credenciales del procesador rechazadas.");
    
    // 2. TOKENIZAR
    const tokenData = await safeOctanoFetch(`${OCTANO_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getOctanoHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify({
        cardData: {
          cardNumber: cardInfo.number,
          cardholderName: cardInfo.name,
          expirationMonth: cardInfo.expiry.split('/')[0],
          expirationYear: cardInfo.expiry.split('/')[1],
        }
      })
    }, 'Tokenización');

    if (!tokenData.cardNumberToken) throw new Error("Tarjeta declinada o inválida.");

    // 3. VENTA (Cálculo de impuestos incluido)
    const subtotalCalc = total; 
    const impuestoCalc = subtotalCalc * 0.16;
    const totalFinal = subtotalCalc + impuestoCalc;

    const salePayload = {
      amount: Number(totalFinal.toFixed(2)),
      currency: 484, // Código ISO numérico para MXN
      reference: `PM-${Date.now()}`, // Prefijo Posiciona Marketing
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad,
        address1: billingInfo.direccion,
        postalCode: billingInfo.codigo_postal,
        state: billingInfo.estado,
        country: 'MX'
      },
      cardData: {
        cardNumberToken: tokenData.cardNumberToken,
        cvv: cardInfo.cvv
      },
      items: items.map((i: CartItem) => ({
        title: i.crovexa_plans?.title || 'Estrategia Personalizada',
        amount: Number((i.custom_price !== null ? i.custom_price : (i.crovexa_plans?.price || 0)).toFixed(2)),
        quantity: i.quantity,
        id: i.plan_id.toString() 
      }))
    };

    const saleData = await safeOctanoFetch(`${OCTANO_BASE_URL}/sale`, {
      method: 'POST',
      headers: getOctanoHeaders({ 'Authorization': `Bearer ${signinData.authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');

    // DEBUG: Ver qué dice Octano si falla
    if (saleData.status !== 'APPROVED') {
      console.error("\n❌ [ERROR DE OCTANO DETALLADO]:", JSON.stringify(saleData, null, 2), "\n");
      const reason = saleData.message || saleData.responseCode || "Transacción declinada.";
      throw new Error(`El banco rechazó el pago: ${reason}`);
    }

    // 4. GUARDAR EN BD
    const { data: checkoutRecord, error: dbError } = await supabaseAdmin
      .from('crovexa_orders')
      .insert({
        nombre: contactInfo.firstName,
        apellidos: contactInfo.lastName,
        pais_region: billingInfo.pais,
        direccion_calle: billingInfo.direccion,
        localidad_ciudad: billingInfo.localidad,
        region_estado: billingInfo.estado,
        codigo_postal: billingInfo.codigo_postal,
        telefono: contactInfo.phone,
        correo_electronico: contactInfo.email,
        subtotal: subtotalCalc,
        impuesto: impuestoCalc,
        total_estimado: totalFinal,
        status: 'paid'
      })
      .select()
      .single();

    if (dbError || !checkoutRecord) {
      console.error("[CRÍTICO] Detalle del error al insertar Checkout:", dbError);
      throw new Error("Pago exitoso, pero falló la generación del recibo.");
    }

    // 5. GUARDAR ITEMS
    const checkoutItems = items.map((item: CartItem) => ({
      order_id: checkoutRecord.id,
      plan_id: item.plan_id,
      quantity: item.quantity,
      custom_price: item.custom_price,
      quote_id: item.quote_id
    }));

    const { error: itemsError } = await supabaseAdmin.from('crovexa_order_items').insert(checkoutItems);
    if (itemsError) console.error("[CRÍTICO] Detalle del error en Items:", itemsError);

    // 6. ENVIAR CORREO
    await sendReceiptEmail(checkoutRecord as Checkout, items, locale === 'en');

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado.";
    return { success: false, message: errorMessage };
  }
}