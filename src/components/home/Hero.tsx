"use client";

import { motion } from "framer-motion";

export function HeroVisuals({ locale }: { locale: string }) {
  const isEs = locale === 'es';

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] hidden lg:block font-sans">
      
      {/* CUADRO PRINCIPAL TECH */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-10 right-0 w-[80%] h-[75%] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900"
      >
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&h=800&fit=crop" 
          alt="Cyber/Tech server room or modern abstract" 
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-1000" 
        />
        {/* Grid overlay para estilo Figma/Tech */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </motion.div>

      {/* TARJETA FLOTANTE TIPO FIGMA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-12 left-0 w-[50%] h-[auto] rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-2xl overflow-hidden shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">sys.architecture.visualizer</span>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop" 
          alt="Abstract geometric" 
          className="w-full h-40 object-cover rounded-lg grayscale opacity-70" 
        />
      </motion.div>

      {/* BADGE NEÓN */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-[45%] -left-6 bg-slate-950 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.2)] border border-sky-500/30 flex items-center gap-3"
      >
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
        <p className="text-sky-100 uppercase tracking-widest text-[10px] font-bold font-mono">
          {isEs ? 'Sistemas Operativos' : 'Systems Operational'}
        </p>
      </motion.div>
    </div>
  );
}