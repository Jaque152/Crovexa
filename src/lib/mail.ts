import { Resend } from 'resend';
import { Checkout, CartItem } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);


const FROM_EMAIL = 'informes@crovexa.com'; 
const INTERNAL_EMAIL = 'contacto@crovexa.com';

const formatPrice = (price: number) => 
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const emailTheme = {
  bgMain: '#fafafa',       
  cardBg: '#ffffff',       
  primary: '#4f46e5',      
  textMain: '#0f172a',     
  textMuted: '#64748b',    
  borderLight: '#e2e8f0',  
  surface: '#f8fafc'       
};

// ============================================================================
// 1. EMAIL DE CHECKOUT (Cliente e Interno)
// ============================================================================
export async function sendReceiptEmail(
  checkout: Checkout, 
  items: CartItem[], 
  isEnglish: boolean = false
) {
  // --- A. PLANTILLA CORPORATIVA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? `Order Confirmation - Welcome to Crovexa` 
    : `Confirmación de Orden - Bienvenido a Crovexa`;

  const htmlClient = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: ${emailTheme.bgMain}; padding: 40px 20px;">
      
      <div style="background-color: ${emailTheme.cardBg}; border-radius: 16px; overflow: hidden; border: 1px solid ${emailTheme.borderLight}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid ${emailTheme.borderLight};">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; color: ${emailTheme.textMain};">
            Crovexa<span style="color: ${emailTheme.primary};"></span>
          </h1>

        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: ${emailTheme.textMain}; margin-top: 0; font-size: 20px; font-weight: 700;">${isEnglish ? 'Hello' : 'Hola'} ${checkout.nombre},</h2>
          <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
            ${isEnglish 
              ? 'Your payment was successfully processed. Our team of consultants is preparing everything to start your project.' 
              : 'Tu pago fue procesado con éxito. Nuestro equipo de consultores está preparando todo para dar inicio a tu proyecto.'}
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
            <thead>
              <tr style="border-bottom: 2px solid ${emailTheme.borderLight}; text-align: left;">
                <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${isEnglish ? 'Service / Program' : 'Servicio / Programa'}</th>
                <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 11px; text-transform: uppercase; text-align: right; letter-spacing: 1px;">${isEnglish ? 'Investment' : 'Inversión'}</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid ${emailTheme.borderLight};">
                  <td style="padding: 15px 0; color: ${emailTheme.textMain}; font-size: 14px; font-weight: 600;">
                    ${item.crovexa_plans?.title || 'Programa Personalizado'}
                    ${item.quote_id ? `<br><span style="font-size:12px; color:${emailTheme.textMuted}; font-weight: normal;">Folio: ${item.quote_id}</span>` : ''}
                  </td>
                  <td style="padding: 15px 0; text-align: right; color: ${emailTheme.textMain}; font-size: 14px; font-weight: bold;">${formatPrice(item.custom_price || item.crovexa_plans?.price || 0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background-color: ${emailTheme.surface}; border-radius: 12px; padding: 25px; text-align: right; border-left: 4px solid ${emailTheme.primary}; border: 1px solid ${emailTheme.borderLight}; border-left-width: 4px;">
            <span style="font-size: 11px; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">${isEnglish ? 'Total (VAT Included)' : 'Total (IVA Incluido)'}</span>
            <span style="font-size: 28px; font-weight: 800; color: ${emailTheme.primary}; display: block; margin-top: 5px;">${formatPrice(checkout.total_estimado)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- B. PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">💳 Nueva Compra Aprobada - Crovexa</h2>
      <p style="color: #64748b;"><strong>ID Transacción:</strong> ${checkout.id}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td colspan="2" style="background: #f8fafc; padding: 10px; font-weight: bold; color: #0f172a; border-radius: 6px 6px 0 0;">Datos del Cliente</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; width: 30%; color: #64748b;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${checkout.nombre} ${checkout.apellidos}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${checkout.correo_electronico}" style="color: #4f46e5;">${checkout.correo_electronico}</a></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${checkout.telefono || 'No proporcionado'}</td></tr>
      </table>

      <h3 style="margin-top: 25px; color: #0f172a;">Programas Contratados</h3>
      <ul style="color: #0f172a; padding-left: 20px;">
        ${items.map(item => `
          <li style="margin-bottom: 8px;">
            ${item.quantity}x <strong>${item.crovexa_plans?.title || 'Programa Personalizado'}</strong> 
            - ${formatPrice(item.custom_price || item.crovexa_plans?.price || 0)}
          </li>
        `).join('')}
      </ul>
      
      <div style="margin-top: 20px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: right;">
        <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Subtotal: ${formatPrice(checkout.subtotal)}</p>
        <p style="margin: 5px 0; color: #64748b; font-size: 14px;">Impuestos: ${formatPrice(checkout.impuesto)}</p>
        <p style="margin: 10px 0 0 0; font-size: 20px; color: #4f46e5;"><strong>TOTAL COBRADO: ${formatPrice(checkout.total_estimado)}</strong></p>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Crovexa <${FROM_EMAIL}>`,
      to: [checkout.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Notificaciones <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `[NUEVA COMPRA] ${checkout.nombre} ${checkout.apellidos} - ${formatPrice(checkout.total_estimado)}`,
      html: htmlInternal,
    })
  ]);
}

// ============================================================================
// 2. EMAIL DE CONTACTO (Cliente e Interno)
// ============================================================================
export interface ContactFormData {
  nombre_completo: string;
  empresa_negocio: string;
  telefono: string;
  correo_electronico: string;
  asunto: string;
  mensaje: string;
}

export async function sendContactConfirmationEmail(data: ContactFormData, isEnglish: boolean = false) {
  
  // --- A. PLANTILLA CORPORATIVA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? "We have received your message - Crovexa" 
    : "Hemos recibido tu mensaje - Crovexa";
  
  const htmlClient = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: ${emailTheme.bgMain}; padding: 40px 20px;">
      
      <div style="background-color: ${emailTheme.cardBg}; border-radius: 16px; overflow: hidden; border: 1px solid ${emailTheme.borderLight}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid ${emailTheme.borderLight};">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; color: ${emailTheme.textMain};">
            Crovexa<span style="color: ${emailTheme.primary};"></span>
          </h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: ${emailTheme.textMain}; margin-top: 0; font-size: 20px; font-weight: 700;">
            ${isEnglish ? `Hi ${data.nombre_completo},` : `Hola ${data.nombre_completo},`}
          </h2>
          <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
            ${isEnglish 
              ? 'We have received your request. Our team of consultants is reviewing your information and will contact you shortly to discuss how we can help your business grow.' 
              : 'Hemos recibido tu solicitud correctamente. Nuestro equipo de consultores está analizando tu información y te contactará a la brevedad para trazar el mejor plan para tu empresa.'}
          </p>

          <div style="background-color: ${emailTheme.surface}; border-radius: 12px; padding: 25px; margin-top: 30px; border: 1px solid ${emailTheme.borderLight}; border-left-width: 4px; border-left-color: ${emailTheme.primary};">
            <p style="font-size: 14px; color: ${emailTheme.textMain}; margin: 5px 0;"><strong>${isEnglish ? 'Subject:' : 'Asunto:'}</strong> ${data.asunto}</p>
            <p style="font-size: 14px; color: ${emailTheme.textMain}; margin: 5px 0;"><strong>${isEnglish ? 'Company:' : 'Empresa:'}</strong> ${data.empresa_negocio}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- B. PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">📋 Nuevo Lead de Contacto - Crovexa</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; width: 30%; color: #64748b;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.nombre_completo}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Empresa:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.empresa_negocio}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.correo_electronico}" style="color: #4f46e5;">${data.correo_electronico}</a></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${data.telefono}</td></tr>
      </table>

      <div style="margin-top: 25px;">
        <h3 style="color: #0f172a; margin-bottom: 10px;">Mensaje Original:</h3>
        <div style="white-space: pre-wrap; color: #333; background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-left: 4px solid #4f46e5; border-radius: 6px; font-size: 14px; line-height: 1.6;">${data.mensaje}</div>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Crovexa <${FROM_EMAIL}>`,
      to: [data.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Notificaciones <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `[LEAD] ${data.asunto} - ${data.empresa_negocio}`,
      html: htmlInternal,
    })
  ]);
}