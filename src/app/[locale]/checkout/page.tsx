"use client";

import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CheckCircle, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { processCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem, CheckoutPayload } from "@/types";

export default function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [billingInfo, setBillingInfo] = useState({ pais: "México", direccion: "", localidad: "", estado: "", codigo_postal: "" });
  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });

  useEffect(() => {
    const savedData = sessionStorage.getItem("nc_temp_contact");
    if (savedData) {
      const { firstName, lastName, email } = JSON.parse(savedData);
      setContactInfo(prev => ({ ...prev, firstName, lastName, email }));
      sessionStorage.removeItem("nc_temp_contact"); 
    }
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");
    
    const payload: CheckoutPayload = {
      locale, contactInfo, billingInfo, cardInfo, items, total  
    };
    
    const res = await processCheckout(payload);

    if (res.success) {
      clearCart();
      setContactInfo({ firstName: "", lastName: "", email: "", phone: "" });
      setBillingInfo({ pais: "México", direccion: "", localidad: "", estado: "", codigo_postal: "" });
      setCardInfo({ number: "", name: "", expiry: "", cvv: "" });
      setShowSuccess(true);
      window.scrollTo(0, 0);
    } else {
      setErrorMsg(res.message || (isEs ? "Ocurrió un error al procesar el pago." : "An error occurred while processing the payment."));
      setIsProcessing(false);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  // Se corrigió el placeholder para garantizar visibilidad separando el color de la opacidad (70%)
  const inputClass = "h-14 bg-white/50 backdrop-blur-sm border border-white focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)] rounded-xl px-5 text-[var(--text-main)] placeholder:text-[var(--text-main)] placeholder:opacity-70 font-medium transition-all shadow-sm w-full";

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-mesh flex items-center justify-center px-4 relative">
        <div className="max-w-lg w-full text-center glass-panel rounded-[2rem] p-10 md:p-16 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-magenta)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[var(--accent-purple)]/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-main)] tracking-tight">
            {isEs ? '¡Estrategia Confirmada!' : 'Strategy Confirmed!'}
          </h1>
          <p className="text-[var(--text-main)]/60 mb-10 text-lg font-medium">
            {isEs 
              ? 'Hemos enviado un recibo detallado a tu correo electrónico con los siguientes pasos.' 
              : 'We have sent a detailed receipt to your email with the next steps.'}
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
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gradient-pop tracking-tight">
          {isEs ? 'Finalizar compra' : 'Complete Purchase'}
        </h1>
        {errorMsg && <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-xl mb-8 font-semibold">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel p-8 border border-white/60 rounded-3xl shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-[var(--text-main)] tracking-wide">
                {isEs ? 'Detalles de facturación' : 'Billing Details'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <Input placeholder={isEs ? "Nombre *" : "First Name *"} required value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "Apellidos *" : "Last Name *"} required value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "Correo electrónico *" : "Email address *"} type="email" required value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "Teléfono *" : "Phone number *"} type="tel" required value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} className={inputClass} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input placeholder={isEs ? "País / Región *" : "Country / Region *"} required value={billingInfo.pais} disabled className={inputClass + " opacity-70"} />
                <Input placeholder={isEs ? "Dirección de la calle *" : "Street address *"} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "Localidad / Ciudad *" : "City / Locality *"} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "Región / Estado *" : "State / Province *"} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} />
                <Input placeholder={isEs ? "Código postal *" : "Postal / Zip code *"} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} />
              </div>
            </div>

            {/* Tarjeta de Pago Estilo Glassmorphism */}
            <div className="glass-panel p-8 border border-white/60 rounded-3xl shadow-xl relative overflow-hidden bg-white/20">
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none"><CreditCard className="w-48 h-48" /></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-3 tracking-wide">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center">
                      <CreditCard className="text-[var(--accent-purple)] w-4 h-4" />
                    </div>
                    {isEs ? 'Método de Pago Seguro' : 'Secure Payment Method'}
                  </h2>
                  <img src="/etomin_logo.svg" alt="Etomin" className="h-6 opacity-60 mix-blend-multiply" />
                </div>
                <div className="grid gap-5 max-w-md">
                  <Input placeholder={isEs ? "Número de tarjeta *" : "Card number *"} required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className={inputClass + " font-mono tracking-widest text-lg"} />
                  <Input placeholder={isEs ? "Nombre en la tarjeta *" : "Name on card *"} required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className={inputClass} />
                  <div className="grid grid-cols-2 gap-5">
                    <Input placeholder="MM/AA *" required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className={inputClass + " text-center"} />
                    <Input placeholder="CVV *" type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className={inputClass + " text-center tracking-widest"} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--text-main)]/10">
                    <img src="/etomin_secbadge.svg" alt="Seguridad" className="h-10 opacity-70 mix-blend-multiply hover:opacity-100 transition-all" />
                    <p className="text-[10px] text-[var(--text-main)]/50 font-bold uppercase tracking-tighter mt-3 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-[var(--accent-cyan)]" /> 
                      {isEs ? 'Datos encriptados bajo protocolo AES-256.' : 'Data encrypted under AES-256 protocol.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <div className="lg:col-span-4 glass-panel p-8 border border-white/60 rounded-3xl shadow-xl sticky top-32">
            <h2 className="text-xl font-bold mb-6 border-b border-[var(--text-main)]/10 pb-4 tracking-wide">
              {isEs ? 'Tu pedido' : 'Your order'}
            </h2>
            <div className="space-y-4 mb-6">
              {items.map((item: CartItem, idx: number) => (
                <div key={idx} className="flex justify-between text-sm items-center font-medium">
                  <span className="text-[var(--text-main)]/60">
                    {item.crovexa_plans?.title || (isEs ? 'Personalizado' : 'Custom')}
                    <span className="text-[var(--accent-purple)] font-bold ml-2">x{item.quantity}</span>
                  </span>
                  <span className="font-bold text-[var(--text-main)]">
                    {formatPrice((item.custom_price || item.crovexa_plans?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--text-main)]/10 pt-6 mb-8 font-sans">
              <div className="flex justify-between items-center mb-2 font-medium">
                <span className="text-[var(--text-main)]/60">Subtotal</span>
                <span className="text-[var(--text-main)]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 font-medium">
                <span className="text-[var(--text-main)]/60">{isEs ? 'IVA (16%)' : 'Tax (16%)'}</span>
                <span className="text-[var(--text-main)]">{formatPrice(total * 0.16)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gradient-pop mt-6">
                <span>{isEs ? 'Total a Pagar' : 'Total to Pay'}</span>
                <span>{formatPrice(total * 1.16)}</span>
              </div>
            </div>
            <Button type="submit" disabled={isProcessing} className="w-full bg-[var(--accent-dark)] hover:scale-105 text-white font-bold h-14 rounded-xl text-lg shadow-xl shadow-[var(--accent-dark)]/20 transition-all">
              {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (isEs ? 'PROCESAR PAGO' : 'PROCESS PAYMENT')}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}