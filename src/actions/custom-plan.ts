'use server';

import { createClient } from '@/lib/supabase/server';

export interface CustomPlanFormData {
  nombre: string;
  apellidos: string;
  correo_electronico: string; 
  id_cotizacion: string; 
  monto: number;
}

export async function processCustomPlan(formData: CustomPlanFormData) {
  try {
    const supabase = await createClient();

    // 1. Buscamos el plan base de manera robusta (acepta cualquiera de los dos nombres)
    const { data: planData, error: planError } = await supabase
      .from('crovexa_plans')
      .select('id')
      .or('title.ilike.%Custom Garage%,title.ilike.%personalizado%')
      .limit(1)
      .single();

    if (planError || !planData) {
      console.error("[CRÍTICO] Error al buscar Plan Maestro:", planError);
      throw new Error("No se encontró la configuración del Plan Personalizado en la base de datos.");
    }

    // 2. Insertamos la cotización en la tabla recién creada
    const { error: insertError } = await supabase
      .from('crovexa_custom_quotes')
      .insert({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo_electronico: formData.correo_electronico,
        id_cotizacion: formData.id_cotizacion, 
        monto_a_pagar: formData.monto,
        payment_status: 'pending'
      });

    if (insertError) {
      console.error("[CRÍTICO] Error al guardar cotización en crovexa_custom_quotes:", insertError);
      throw new Error("Ocurrió un error al registrar la cotización en el servidor.");
    }

    // 3. Devolvemos la información al frontend para que la agregue al carrito
    return { 
      success: true, 
      planId: planData.id, 
      quoteId: formData.id_cotizacion, 
      customPrice: formData.monto 
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado del servidor.";
    return { success: false, message: errorMessage };
  }
}