"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ArrowUpRight, Cpu, CheckCircle, Plus,Server, Terminal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AddToCartButton } from './services/AddToCartButton';
import { Plan } from '@/types';
import { ClientT } from '@/components/shared/ClientT';

export default function HomePage() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const supabase = createClient();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeService, setActiveService] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from('crovexa_plans') 
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      if (data) setPlans(data as Plan[]);
    };
    fetchPlans();
  }, [supabase]);

  const standardPlans = plans.filter(p => !p.title.toLowerCase().includes('personalizado'));
  const customPlan = plans.find(p => p.title.toLowerCase().includes('personalizado'));
  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  const highlights = [
    { label: isEs ? "Núcleo" : "Core", title: isEs ? "Arquitectura de Datos" : "Data Architecture" },
    { label: isEs ? "Interfaz" : "UI/UX", title: isEs ? "Experiencias Fricción Cero" : "Zero-Friction Experiences" },
    { label: isEs ? "Seguridad" : "SecOps", title: isEs ? "Infraestructura Blindada" : "Shielded Infrastructure" }
  ];

  const services = [
    {
      title: isEs ? "Desarrollo y Arquitectura Web" : "Web Architecture & Dev",
      short: isEs ? "Escalabilidad construida en código moderno." : "Scalability built on modern code.",
      detail: isEs ? "Construimos ecosistemas digitales desde la raíz usando stacks modernos (Next.js, Node, Python). Integramos bases de datos relacionales y NoSQL para garantizar flujos de información ininterrumpidos y alta disponibilidad." : "We build digital ecosystems from the root up using modern stacks. We integrate relational and NoSQL databases to guarantee uninterrupted info flows and high availability."
    },
    {
      title: isEs ? "Interfaces y Prototipado" : "UI/UX & Prototyping",
      short: isEs ? "Diseño de interacciones centradas en el usuario." : "User-centric interaction design.",
      detail: isEs ? "Traduciendo lógica compleja en vistas limpias. Empleamos sistemas de diseño y wireframing avanzado para validar cada flujo antes de escribir una sola línea de código, reduciendo la fricción visual." : "Translating complex logic into clean views. We use design systems and advanced wireframing to validate each flow before writing a single line of code."
    },
    {
      title: isEs ? "Inteligencia Predictiva" : "Predictive Intelligence",
      short: isEs ? "Análisis de mercado basado en telemetría." : "Market analysis based on telemetry.",
      detail: isEs ? "Dejamos atrás la especulación. Extraemos, estructuramos y analizamos el comportamiento de tu nicho para desplegar tácticas con alta probabilidad de conversión y retención." : "We leave speculation behind. We extract, structure, and analyze your niche's behavior to deploy tactics with a high probability of conversion."
    },
    {
      title: isEs ? "Cumplimiento y Seguridad" : "Compliance & Security",
      short: isEs ? "Protocolos que protegen tu operación." : "Protocols that protect your operation.",
      detail: isEs ? "Auditorías continuas y alineación con normativas vigentes. Fortalecemos las políticas internas de tu plataforma para mitigar vulnerabilidades y asegurar un entorno de trabajo resiliente." : "Continuous audits and alignment with current regulations. We strengthen your platform's internal policies to mitigate vulnerabilities."
    }
  ];

  const processSteps = [
    { num: "01", title: isEs ? "Requisitos" : "Requirements", text: isEs ? "Mapeo de arquitectura y necesidades técnicas." : "Architecture and tech needs mapping." },
    { num: "02", title: isEs ? "Wireframe" : "Wireframe", text: isEs ? "Prototipado visual y flujos lógicos." : "Visual prototyping and logical flows." },
    { num: "03", title: isEs ? "Commit" : "Commit", text: isEs ? "Despliegue del entorno de trabajo." : "Deployment of the working environment." },
    { num: "04", title: isEs ? "Testing" : "Testing", text: isEs ? "Auditoría de calidad y aseguramiento." : "QA and security audits." },
    { num: "05", title: isEs ? "Producción" : "Production", text: isEs ? "Lanzamiento y monitoreo continuo." : "Launch and continuous monitoring." }
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION (Tech-Oriented) */}
      <section id="nosotros" className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-sky-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl relative z-10 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 border border-slate-800 bg-slate-900/50 backdrop-blur-md px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              {isEs ? 'Sistema en línea v2.0' : 'System online v2.0'}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-tight">
            {isEs ? 'Ingeniería de' : 'Growth'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">{isEs ? 'Crecimiento.' : 'Engineering.'}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-light">
            {isEs 
              ? 'Arquitectamos ecosistemas digitales y operativos de alto rendimiento. Infraestructuras resilientes que detonan escalabilidad sin fricción.' 
              : 'We architect high-performance digital and operational ecosystems. Resilient infrastructures that trigger frictionless scalability.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl">
            {highlights.map((h, i) => (
              <div key={i} className="flex-1 min-w-[200px] border border-slate-800 bg-slate-900/40 rounded-2xl p-4 flex flex-col items-start backdrop-blur-sm">
                <Cpu className="w-5 h-5 text-sky-400 mb-3" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">{h.label}</span>
                <span className="text-sm font-semibold text-slate-200">{h.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MÓDULOS OPERATIVOS (Accordion Rediseñado a Paneles Tech) */}
      <section id="soluciones" className="py-24 px-6 border-t border-slate-800/50 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 flex flex-col items-start">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              {isEs ? 'Módulos Operativos' : 'Operational Modules'}
            </h2>
          </div>

          <div className="grid gap-4">
            {services.map((service, idx) => (
              <div key={idx} className="group border border-slate-800 bg-slate-900/30 rounded-2xl overflow-hidden transition-all hover:bg-slate-900/60 hover:border-sky-900/50">
                <button 
                  onClick={() => setActiveService(activeService === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-slate-700 font-mono text-xl font-bold group-hover:text-sky-500/50 transition-colors">0{idx + 1}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-200">{service.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{service.short}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center transition-transform duration-500 ${activeService === idx ? 'rotate-45 border-sky-500/30 bg-sky-500/10 text-sky-400' : 'text-slate-400'}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {activeService === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 ml-12 border-l border-slate-800">
                        <p className="text-slate-400 leading-relaxed text-sm max-w-2xl">
                          {service.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PIPELINE DE TRABAJO */}
      <section id="metodo" className="py-24 px-6 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {isEs ? 'Pipeline de Implementación' : 'Deployment Pipeline'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {processSteps.map((step, idx) => (
              <div key={idx} className="border border-slate-800 bg-[#020617] p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="text-sky-500/20 font-mono text-4xl font-black absolute -bottom-2 -right-2 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h4 className="text-base font-bold text-slate-200 mb-2">{step.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed relative z-10">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTANCIAS (Planes) - REDISEÑO HORIZONTAL "SERVER RACK" (Traducido) */}
      <section id="programas" className="py-32 px-6 relative border-t border-slate-800/50 bg-[#020617]">
        {/* Decoración de fondo tech */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-sky-500/50 to-transparent"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 font-mono text-[10px] uppercase tracking-widest mb-6">
              <Server className="w-3 h-3" /> {isEs ? 'Nodos de Infraestructura' : 'Infrastructure Nodes'}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              {isEs ? 'Inicializa tu Entorno' : 'Initialize your Environment'}
            </h2>
            <p className="text-slate-400">
              {isEs ? 'Selecciona la capacidad y parámetros de tu despliegue.' : 'Select the capacity and parameters of your deployment.'}
            </p>
          </div>

          {/* RACK DE SERVIDORES (Planes Estándar) */}
          <div className="flex flex-col gap-4">
            {standardPlans.map((plan) => {
              let parsedFeatures: string[] = [];
              try { parsedFeatures = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features; } catch(e){}

              return (
                <div key={plan.id} className="relative group flex flex-col lg:flex-row bg-slate-900/20 border border-slate-800 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 overflow-hidden">
                  
                  {/* Indicador de Estado (Línea lateral neón) */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-800 group-hover:bg-sky-500 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.6)] transition-all duration-500"></div>

                  {/* Bloque 1: Info Base */}
                  <div className="w-full lg:w-[35%] p-6 lg:p-8 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 font-mono flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-500" />
                      {/* Envuelto en ClientT para la traducción dinámica desde DB */}
                      <ClientT>{plan.title}</ClientT>
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl lg:text-4xl font-black text-white">{formatPrice(plan.price)}</span>
                    </div>
                    {/* Texto estático con ternario isEs */}
                    <span className="text-[10px] font-mono text-slate-500 uppercase mt-1">
                      {isEs ? 'MXN + IVA / Instancia' : 'MXN + VAT / Instance'}
                    </span>
                  </div>
                  
                  {/* Bloque 2: Nodos/Features (Grid denso) */}
                  <div className="w-full lg:w-[45%] p-6 lg:p-8 border-y lg:border-y-0 lg:border-l border-slate-800 flex flex-col justify-center bg-slate-950/30">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                      {parsedFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-400">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors shrink-0" />
                          <span className="leading-snug">
                            {/* Envuelto en ClientT para la traducción dinámica desde DB */}
                            <ClientT>{feat}</ClientT>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bloque 3: Acción */}
                  <div className="w-full lg:w-[20%] p-6 lg:p-8 flex items-center justify-center lg:justify-end border-l-0 lg:border-l border-slate-800">
                    <div className="w-full">
                      <AddToCartButton planId={plan.id} />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* CLÚSTER PERSONALIZADO (Enterprise) */}
          {customPlan && (
            <div className="mt-6 relative border border-dashed border-slate-700 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-900/40 rounded-2xl overflow-hidden p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-sky-500/50 transition-colors">
              
              <div className="max-w-xl relative z-10">
                <div className="flex items-center gap-2 text-sky-400 mb-3 font-mono text-[10px] uppercase tracking-widest bg-sky-500/10 inline-block px-3 py-1 rounded-full">
                  <Code2 className="w-3 h-3 inline pb-0.5" /> informes@crovexa.com
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {/* Envuelto en ClientT */}
                  <ClientT>{customPlan.title}</ClientT>
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {/* Envuelto en ClientT */}
                  <ClientT>{customPlan.description}</ClientT>
                </p>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3 relative z-10 shrink-0">
                <Link href={`/${locale}/contact`} className="bg-white text-slate-950 px-6 py-3 rounded-lg font-bold text-xs text-center hover:bg-sky-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5">
                  {isEs ? 'Contactar' : 'Contact'} <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href={`/${locale}/pricing`} className="bg-transparent border border-slate-700 text-slate-300 px-6 py-3 rounded-lg font-mono text-xs text-center hover:bg-slate-800 hover:text-white transition-colors">
                  {isEs ? '> Pagar Folio' : '> Pay Folio'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}