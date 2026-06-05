"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { submitContact } from "@/actions/contact";
import { ContactFormData } from "@/lib/mail";
import { CheckCircle, Loader2, Send, MapPin, Phone, Mail as MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<ContactFormData>({
    nombre_completo: "",
    empresa_negocio: "",
    telefono: "",
    correo_electronico: "",
    asunto: "",
    mensaje: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await submitContact(formData, locale);

    if (res.success) {
      setFormData({
        nombre_completo: "",
        empresa_negocio: "",
        telefono: "",
        correo_electronico: "",
        asunto: "",
        mensaje: ""
      });
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.message || (isEs ? "Ocurrió un error." : "An error occurred."));
    }
    setIsSubmitting(false);
  };

  // Se corrigió el placeholder separando el color de la opacidad (70%)
  const inputClass = "h-14 bg-white/50 backdrop-blur-sm border border-white focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] rounded-xl px-5 text-[var(--text-main)] placeholder:text-[var(--text-main)] placeholder:opacity-70 font-medium transition-all shadow-sm w-full";

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-mesh flex items-center justify-center px-4 relative">
        <div className="max-w-lg w-full text-center glass-panel rounded-[2rem] p-10 md:p-16 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[var(--accent-cyan)]/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-main)] tracking-tight">
            {isEs ? '¡Mensaje Enviado!' : 'Message Sent!'}
          </h1>
          <p className="text-[var(--text-main)]/60 mb-10 text-lg font-medium">
            {isEs 
              ? 'Hemos recibido tus datos correctamente. Nuestro equipo se pondrá en contacto contigo pronto.' 
              : 'We received your information successfully. Our team will contact you soon.'}
          </p>
          <Button asChild className="w-full bg-[var(--accent-dark)] hover:scale-105 text-white font-bold h-14 rounded-xl transition-all shadow-xl">
            <Link href={`/${locale}/`}>{isEs ? 'Volver al Inicio' : 'Back to Home'}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mesh pt-32 pb-24 text-[var(--text-main)] relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-pop tracking-tight">
            {isEs ? 'Contacto' : 'Contact'}
          </h1>
          <p className="text-[var(--text-main)]/60 max-w-2xl mx-auto font-medium text-lg">
            {isEs 
              ? '¿Listo para hackear tu crecimiento? Escríbenos o visítanos, estamos listos para actuar.' 
              : 'Ready to hack your growth? Write to us or visit us, we are ready to act.'}
          </p>
        </div>
        
        {/* TARJETAS DE INFORMACIÓN DE CONTACTO */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center shadow-xl hover:border-[var(--accent-cyan)]/50 transition-colors">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[var(--text-main)]">
              {isEs ? 'Sede Central' : 'Headquarters'}
            </h3>
            <p className="text-[var(--text-main)]/60 text-sm font-medium leading-relaxed">
              Avenida Insurgentes Sur, N°933, Int 102 Piso 1<br />
              Colonia Nápoles, Alcaldía Benito Juárez<br />
              C.P. 03810, CDMX
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center shadow-xl hover:border-[var(--accent-cyan)]/50 transition-colors">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[var(--text-main)]">
              {isEs ? 'Línea Directa' : 'Direct Line'}
            </h3>
            <p className="text-[var(--text-main)]/60 text-sm font-medium">
              <a href="tel:+5215557055800" className="hover:text-[var(--accent-purple)] transition-colors">
                +52 1 55 9136 2019
              </a>
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center shadow-xl hover:border-[var(--accent-cyan)]/50 transition-colors">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <MailIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[var(--text-main)]">
              {isEs ? 'Digital Mail' : 'Digital Mail'}
            </h3>
            <p className="text-[var(--text-main)]/60 text-sm font-medium">
              <a href="informes@crovexa.com" className="hover:text-[var(--accent-purple)] transition-colors">
                informes@crovexa.com
              </a>
            </p>
          </div>
        </div>

        {errorMsg && <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-xl mb-8 font-semibold">{errorMsg}</div>}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 border border-white/60 rounded-3xl shadow-2xl space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input placeholder={isEs ? "Nombre Completo *" : "Full Name *"} required value={formData.nombre_completo} onChange={(e)=>setFormData({...formData, nombre_completo:e.target.value})} className={inputClass} />
            <Input placeholder={isEs ? "Empresa / Negocio *" : "Company / Business *"} required value={formData.empresa_negocio} onChange={(e)=>setFormData({...formData, empresa_negocio:e.target.value})} className={inputClass} />
            <Input placeholder={isEs ? "Teléfono *" : "Phone Number *"} required type="tel" value={formData.telefono} onChange={(e)=>setFormData({...formData, telefono:e.target.value})} className={inputClass} />
            <Input placeholder={isEs ? "Correo Electrónico *" : "Email Address *"} required type="email" value={formData.correo_electronico} onChange={(e)=>setFormData({...formData, correo_electronico:e.target.value})} className={inputClass} />
          </div>
          <Input placeholder={isEs ? "Asunto *" : "Subject *"} required value={formData.asunto} onChange={(e)=>setFormData({...formData, asunto:e.target.value})} className={inputClass} />
          <textarea 
            placeholder={isEs ? "Escribe tu mensaje aquí... *" : "Write your message here... *"} 
            required 
            value={formData.mensaje} 
            onChange={(e)=>setFormData({...formData, mensaje:e.target.value})} 
            /* Se corrigió el placeholder en el textarea */
            className="w-full min-h-[150px] bg-white/50 backdrop-blur-sm border border-white focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] rounded-xl p-5 text-[var(--text-main)] placeholder:text-[var(--text-main)] placeholder:opacity-70 font-medium transition-all shadow-sm resize-y" 
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--accent-dark)] hover:scale-105 text-white font-bold h-14 rounded-xl text-lg shadow-xl transition-all">
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : <span className="flex items-center gap-2"><Send className="w-5 h-5"/> {isEs ? 'Enviar Mensaje' : 'Send Message'}</span>}
          </Button>
        </form>
      </div>
    </main>
  );
}