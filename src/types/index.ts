export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Plan {
  id: string; // Cambiado a UUID (string)
  title: string;
  price: number;
  description: string | null;
  features?: string[] | Json;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: string; // Cambiado a UUID (string)
  session_id: string;
  plan_id: string; // Cambiado a UUID (string)
  quantity: number;
  custom_price: number | null; 
  quote_id: string | null;     
  created_at?: string;
  crovexa_plans?: Plan; // Actualizado a crovexa_plans
}

export interface Checkout {
  id: string;
  nombre: string;
  apellidos: string;
  pais_region: string;
  direccion_calle: string;
  localidad_ciudad: string;
  region_estado: string;
  codigo_postal: string;
  telefono: string | null;
  correo_electronico: string;
  subtotal: number;
  impuesto: number;
  total_estimado: number;
  status: string;
  created_at: string;
}

export interface CheckoutItem {
  id: string;
  order_id: string; 
  plan_id: string;
  quantity: number;
  custom_price: number | null;
  quote_id: string | null;
}

export interface Contact {
  id: string;
  nombre_completo: string;
  empresa_negocio: string;
  telefono: string;
  correo_electronico: string;
  asunto: string;
  mensaje: string;
  created_at: string;
}

export interface CustomPlanPayment {
  id: string;
  nombre: string;
  apellidos: string;
  correo_electronico: string;
  id_cotizacion: string;
  monto_a_pagar: number;
  payment_status: string;
  created_at: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BillingInfo {
  pais: string;
  direccion: string;
  localidad: string;
  estado: string;
  codigo_postal: string;
}

export interface CardInfo {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutPayload {
  locale: string;
  contactInfo: ContactInfo;
  billingInfo: BillingInfo;
  cardInfo: CardInfo;
  items: CartItem[]; 
  total: number;
}