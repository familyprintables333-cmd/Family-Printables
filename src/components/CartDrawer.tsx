import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Download, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/currency';
import { resolveImageUrl, IMAGES } from '../assets/images';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  currency: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Your Digital Bag
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item list */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Your bag is empty
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Explore our categories to choose workbooks, routine charts, or bedtime stories.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-start">
                <img
                  src={resolveImageUrl(item.product.image)}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/80"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = IMAGES.coverToddler;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.product.pages} pages · Instant PDF
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1 tabular-nums">
                    {formatCurrency(item.product.priceUSD, currency)}
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg text-xs overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="px-2 py-0.5 hover:bg-slate-100 text-slate-600"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-semibold text-slate-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="px-2 py-0.5 hover:bg-slate-100 text-slate-600"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Module */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-extrabold text-slate-900 text-lg tabular-nums">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>
                Zero Shipping Fees · Instant Download Worldwide
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Apple Pay, Google Pay &amp; Stripe Encrypted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
