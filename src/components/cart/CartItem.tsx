'use client';

import { useTransition } from 'react';
import { CartItem } from '@/types';
import { updateQuantity } from '@/actions/cart'; // Importación correcta del Server Action
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

export function CartItemComponent({ item }: { item: CartItem }) {
  const { refreshCart, removeFromCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const isEs = locale === 'es';

  // Usamos crovexa_plans en lugar de plans_nc
  const price = item.custom_price !== null ? item.custom_price : (item.crovexa_plans?.price || 0);  
  const formatPrice = (p: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(p);

  const handleUpdateQty = (newQty: number) => {
    if (newQty < 1) return;
    startTransition(async () => {
      await updateQuantity(item.id, newQty);
      await refreshCart(); // Refrescamos para traer el nuevo total
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(item.id);
    });
  };

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-white/50 glass-panel bg-white/40 relative overflow-hidden group transition-all hover:border-[var(--accent-cyan)]/50 hover:shadow-lg">
      
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-purple)]" />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-between">
        <div className="pr-6">
          <h4 className="font-bold text-lg text-[var(--text-main)] leading-tight tracking-tight">
            {item.crovexa_plans?.title || (isEs ? 'Estrategia Personalizada' : 'Custom Strategy')}
          </h4>
          
          {item.quote_id && (
            <p className="text-xs text-[var(--accent-purple)] font-bold mt-1 uppercase tracking-wider">
              {isEs ? 'Folio:' : 'Ref:'} {item.quote_id}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 bg-white/50 rounded-full p-1 border border-white/60 shadow-sm">
            <button
              onClick={() => handleUpdateQty(item.quantity - 1)}
              disabled={item.quantity <= 1 || isPending}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--accent-purple)] text-[var(--text-main)]/60 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--text-main)]/60"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            <span className="font-bold text-sm text-[var(--text-main)] w-4 text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleUpdateQty(item.quantity + 1)}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--accent-purple)] text-[var(--text-main)]/60 hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-[var(--text-main)]">
              {formatPrice(price * item.quantity)}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleRemove}
        disabled={isPending}
        title={isEs ? "Eliminar" : "Remove"}
        className="absolute top-4 right-4 p-2 text-[var(--text-main)]/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}