"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, ShoppingCart, Menu, X, Terminal } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

export function Navigation() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setIsOpen, items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isEs = locale === 'es';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
    router.push(`${segments.join('/')}${currentHash}`);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: isEs ? 'Arquitectura' : 'Architecture', href: `/${locale}/#nosotros` },
    { name: isEs ? 'Módulos' : 'Modules', href: `/${locale}/#soluciones` },
    { name: isEs ? 'Framework' : 'Framework', href: `/${locale}/#metodo` },
    { name: isEs ? 'Despliegue' : 'Deployment', href: `/${locale}/#programas` },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100] transition-all duration-300">
      <div className={`flex items-center justify-between px-6 py-4 rounded-3xl border transition-all duration-500 ${
        isScrolled ? 'bg-[#0f172a]/70 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-sky-900/10' : 'bg-transparent border-transparent'
      }`}>
        
        <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-white flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">CX</span>
          </div>
          Crovexa
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/50 rounded-full p-1.5 border border-slate-800">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs font-semibold text-slate-300 hover:text-sky-400 hover:bg-slate-800/50 px-4 py-2 rounded-full transition-all">
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* TRADUCTOR DESKTOP (Oculto en móvil) */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button onClick={() => switchLocale('es')} className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${locale === 'es' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>ES</button>
            <button onClick={() => switchLocale('en')} className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${locale === 'en' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>EN</button>
          </div>

          <Link href={`/${locale}/contact`} className="hidden md:flex items-center gap-2 bg-white text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-sky-50 transition-all">
            <Terminal className="w-3.5 h-3.5" />
            {isEs ? 'Inicializar' : 'Initialize'}
          </Link>

          <button onClick={() => setIsOpen(true)} className="relative p-2 text-slate-300 hover:text-white bg-slate-800/50 rounded-full border border-slate-700 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                {items.length}
              </span>
            )}
          </button>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-full">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 mx-2 glass-panel-dark rounded-2xl animate-in slide-in-from-top-4">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors border-b border-slate-800 pb-3">
                {link.name}
              </Link>
            ))}
            
            {/* TRADUCTOR MÓVIL (Nuevo) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                {isEs ? 'Idioma' : 'Language'}
              </span>
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-700">
                <button onClick={() => switchLocale('es')} className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${locale === 'es' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>ES</button>
                <button onClick={() => switchLocale('en')} className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${locale === 'en' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>EN</button>
              </div>
            </div>

            <Link href={`/${locale}/contact`} onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-sky-400 flex items-center gap-2 pt-2">
              <Terminal className="w-4 h-4" /> {isEs ? 'Inicializar Proyecto' : 'Initialize Project'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}