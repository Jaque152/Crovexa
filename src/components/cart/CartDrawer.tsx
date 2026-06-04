'use client';

import { useCart } from '@/hooks/use-cart';
import { X, Server, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemComponent } from './CartItem';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, total } = useCart();
  const locale = useLocale();
  const isEs = locale === 'es';

  if (!isOpen) return null;

  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => setIsOpen(false)} 
      />
      
      <div className="relative w-full max-w-md bg-[#020617] border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header Consola */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <h2 className="text-xl font-mono font-bold text-white flex items-center gap-3">
            <Server className="text-sky-400 w-5 h-5" />
            {isEs ? 'Cola de Despliegue' : 'Deployment Queue'}
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors p-2 bg-slate-800/50 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 border border-slate-800 bg-slate-900/50 rounded-2xl flex items-center justify-center text-slate-700">
                <Server className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-mono text-xs">
                {isEs ? '0 instancias en cola.' : '0 instances queued.'}
              </p>
            </div>
          ) : (
            items.map((item) => <CartItemComponent key={item.id} item={item} />)
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-[#020617]">
            <div className="flex justify-between items-end mb-6 font-mono">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {isEs ? 'Coste Total' : 'Total Cost'}
              </span>
              <div className="text-right">
                  <span className="text-2xl font-black text-white block">{formatPrice(total * 1.16)}</span>
                  <span className="text-[9px] text-sky-400 font-bold uppercase tracking-tighter">
                    {isEs ? 'Base + 16% IVA' : 'Base + 16% VAT'}
                  </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 h-12 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all p-0">
                <Link 
                  href={`/${locale}/checkout`} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full h-full font-bold text-sm"
                >
                  {isEs ? 'Ejecutar Transacción' : 'Execute Transaction'} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}