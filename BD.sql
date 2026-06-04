-- =======================================================
-- 1. CREACIÓN DE TABLAS (ECOSISTEMA ACTVREACH "crovexa_")
-- =======================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS crovexa_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS crovexa_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    correo_electronico TEXT NOT NULL,
    telefono TEXT,
    direccion_calle TEXT,
    localidad_ciudad TEXT,
    region_estado TEXT,
    codigo_postal TEXT,
    pais_region TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    impuesto NUMERIC(10, 2) NOT NULL,
    total_estimado NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS crovexa_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES crovexa_orders(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES crovexa_plans(id),
    quantity INT NOT NULL,
    custom_price NUMERIC(10, 2),
    quote_id TEXT
);

CREATE TABLE IF NOT EXISTS crovexa_cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    plan_id UUID REFERENCES crovexa_plans(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    custom_price NUMERIC(10, 2),
    quote_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS crovexa_custom_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    correo_electronico TEXT NOT NULL,
    id_cotizacion TEXT NOT NULL,
    monto_a_pagar NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =======================================================
-- 2. REGLAS DE SEGURIDAD (RLS)
-- =======================================================
ALTER TABLE crovexa_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crovexa_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crovexa_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crovexa_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crovexa_custom_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica planes AR" ON crovexa_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Insertar ordenes AR" ON crovexa_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar items orden AR" ON crovexa_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Acceso carrito AR" ON crovexa_cart_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Insertar cotizaciones AR" ON crovexa_custom_quotes FOR INSERT WITH CHECK (true);

-- =======================================================
-- 3. INSERCIÓN DE LOS PROGRAMAS EXACTOS DE LAS IMÁGENES
-- =======================================================
INSERT INTO crovexa_plans (title, description, price, features) VALUES
('Gestión de Campaña Multicanal Premium', '', 25000.00, '["Planeación y ejecución en redes, email, y Google Ads", "Producción de 2 videos cortos y gráficas", "Reporte detallado + ROI estimado"]'::jsonb),
('Capacitación en Marketing Digital', '', 5000.00, '["Taller de 1 hora en línea", "Enfocado en redes sociales y contenido", "Material descargable incluido"]'::jsonb),
('Estudio de Mercado Local (MiPyME)', '', 18000.00, '["2 focus groups", "Encuesta cuantitativa (hasta 100 encuestas)", "Reporte ejecutivo + presentación"]'::jsonb),
('Encuesta Online para Clientes Actuales', '', 2200.00, '["Diseño de formulario", "Envío digital (hasta 20 contactos)", "Análisis básico de respuestas"]'::jsonb),
('Identidad Corporativa Completa', '', 9000.00, '["Logotipo + paleta de colores + tipografía", "Diseño de tarjeta, 10 firmas de correo, papelería", "Manual básico de marca (PDF)"]'::jsonb),
('Diseño de Logotipo Profesional', '', 3000.00, '["2 propuestas iniciales", "2 rondas de cambios", "Entrega de archivos digitales para impresión y digital"]'::jsonb),
('Consultoría Integral PyME', '', 5300.00, '["Análisis FODA del negocio", "Propuesta de estrategia de marca", "Plan de medios y contenido", "Hasta 2 horas de asesoría ajustada a tiempos libres"]'::jsonb),
('Diagnóstico Exprés de Estrategia Comercial', '', 1200.00, '["Revisión de canales de marketing", "Recomendaciones generales"]'::jsonb),
('Mini Campaña Local en Medios Digitales', '', 2500.00, '["3 diseños publicitarios digitales", "1 plantilla para publicación en redes sociales", "Reporte básico de resultados"]'::jsonb),
('Anuncios en Redes Sociales', '', 1300.00, '["1 plantilla para publicación en redes sociales", "Segmentación básica"]'::jsonb),
('Programa Personalizado', 'Si nuestros programas actuales no se ajustan a tus necesidades, contáctanos y diseñaremos uno a tu medida.', 0.00, '["Diseño a medida de tus requerimientos", "Asignación de folio personalizado", "Cotización previa necesaria"]'::jsonb);