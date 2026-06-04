"use client";

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Terminal, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const isEs = locale === 'es';

  const sections = {
    empresa: [
      { name: isEs ? "Núcleo" : "Core", href: `/${locale}/#nosotros` },
      { name: isEs ? "Módulos" : "Modules", href: `/${locale}/#soluciones` },
      { name: isEs ? "Framework" : "Framework", href: `/${locale}/#metodo` },
    ],
    legal: [
      { name: isEs ? "Privacidad de Datos" : "Data Privacy", href: `/${locale}/legal/privacy` },
      { name: isEs ? "Términos Operativos" : "Operational Terms", href: `/${locale}/legal/terms-conditions` },
    ]
  };

  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-20 pb-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-1 flex flex-col items-start">
            <Link href={`/${locale}`} className="text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center">
                <span className="text-slate-950 font-black text-[10px]">CX</span>
              </div>
              Crovexa
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              {isEs 
                ? "Diseño estructural y desarrollo de alto rendimiento para proyectos que demandan estabilidad, escalabilidad y una experiencia de usuario impecable." 
                : "Structural design and high-performance development for projects demanding stability, scalability, and flawless UX."}
            </p>
          </div>

          <div>
            <h4 className="font-mono text-slate-300 mb-6 uppercase tracking-widest text-[10px]">Index</h4>
            <ul className="space-y-3">
              {sections.empresa.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-sky-400 transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-slate-300 mb-6 uppercase tracking-widest text-[10px]">Legal</h4>
            <ul className="space-y-3">
              {sections.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-sky-400 transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-slate-300 mb-6 uppercase tracking-widest text-[10px]">{isEs ? "Telemetría" : "Telemetry"}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <span className="text-xs">CDMX, MÉXICO. C.P. 03810</span> 
              </li>
              <li className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-xs font-mono">root@crovexa.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-xs font-mono">+52 55 9136 2019</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} CROVEXA SYSTEMS
          </p>
        </div>
      </div>
    </footer>
  );
}