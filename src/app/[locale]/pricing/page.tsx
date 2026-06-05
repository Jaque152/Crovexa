"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { processCustomPlan, CustomPlanFormData } from "@/actions/custom-plan";
import { Loader2, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function CustomPricingPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const isEs = locale === 'es';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState<CustomPlanFormData>({
    nombre: "",
    apellidos: "",
    correo_electronico: "",
    id_cotizacion: "", 
    monto: 0, 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.monto <= 0) {
      setErrorMsg(isEs ? "El monto calculado debe ser mayor a cero." : "The calculated amount must be greater than zero.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const res = await processCustomPlan(formData);

    if (res.success && res.planId && res.customPrice && res.quoteId) {
      
      sessionStorage.setItem("nc_temp_contact", JSON.stringify({
        firstName: formData.nombre,
        lastName: formData.apellidos,
        email: formData.correo_electronico
      }));

      const added = await addToCart(
        res.planId,          
        1,                   
        res.customPrice,     
        res.quoteId          
      );

      if (added) {
        router.push(`/${locale}/checkout`);
      } else {
        setErrorMsg(isEs ? "Error al sincronizar con el carrito de compras." : "Error syncing with the shopping cart.");
        setIsSubmitting(false);
      }

    } else {
      setErrorMsg(res.message || (isEs ? "Error al procesar el plan personalizado." : "Error processing the custom plan."));
      setIsSubmitting(false);
    }
  };

  // Se corrigió el placeholder separando el color de la opacidad (70%)
  const inputClass = "h-14 bg-white/50 backdrop-blur-sm border border-white focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)] rounded-xl px-5 text-[var(--text-main)] placeholder:text-[var(--text-main)] placeholder:opacity-70 font-medium transition-all shadow-sm w-full";

  return (
    <main className="min-h-screen bg-mesh pt-32 pb-24 text-[var(--text-main)] relative">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] shadow-lg mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {isEs ? 'Cotizador' : 'Custom Pricing'}
          </h1>
          <p className="text-[var(--text-main)]/60 font-medium text-lg">
            {isEs 
              ? 'Ingresa tu folio de cotización y completa tus datos para proceder al pago.' 
              : 'Enter your quote reference and complete your details to proceed to payment.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-xl mb-8 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 border border-white/60 rounded-3xl shadow-2xl space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input 
              placeholder={isEs ? "Nombre *" : "First Name *"} 
              required 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
              className={inputClass} 
            />
            <Input 
              placeholder={isEs ? "Apellidos *" : "Last Name *"} 
              required 
              value={formData.apellidos} 
              onChange={(e) => setFormData({...formData, apellidos: e.target.value})} 
              className={inputClass} 
            />
          </div>
          
          <Input 
            placeholder={isEs ? "Correo Electrónico *" : "Email Address *"} 
            type="email" 
            required 
            value={formData.correo_electronico} 
            onChange={(e) => setFormData({...formData, correo_electronico: e.target.value})} 
            className={inputClass} 
          />

          <Input 
            placeholder={isEs ? "Folio de Cotización (Ej. COT-1234) *" : "Quote Reference (e.g. COT-1234) *"} 
            required 
            value={formData.id_cotizacion} 
            onChange={(e) => setFormData({...formData, id_cotizacion: e.target.value.toUpperCase()})} 
            className={inputClass + " font-mono tracking-wider font-bold text-[var(--accent-purple)]"} 
          />

          <div>
            <label className="block text-sm font-bold text-[var(--text-main)]/70 mb-2">
              {isEs ? 'Presupuesto Acordado (MXN) *' : 'Agreed Budget (MXN) *'}
            </label>
            <div className="relative flex items-center">
              {/* Contenedor del símbolo centrado con precisión */}
              <div className="absolute left-5 flex items-center justify-center pointer-events-none z-10">
                <span className="text-[var(--text-main)]/50 font-bold text-xl">$</span>
              </div>
              
              <Input 
                type="number" 
                min="0.o"
                step="0.01"
                required 
                value={formData.monto || ""} 
                onChange={(e) => setFormData({...formData, monto: Number(e.target.value)})} 
                /* Usamos !pl-12 para forzar el espacio y text-xl para darle más peso al número */
                className={`${inputClass} !pl-12 text-xl font-bold`} 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-[var(--accent-dark)] hover:scale-105 text-white font-bold h-14 rounded-xl text-lg mt-6 shadow-xl transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              <span className="flex items-center gap-2">
                {isEs ? 'Añadir al Carrito' : 'Add to Cart'} <ArrowRight className="w-5 h-5 ml-1"/>
              </span>
            )}
          </Button>
        </form>

      </div>
    </main>
  );
}