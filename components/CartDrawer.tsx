'use client'

import Link from 'next/link'
import { X, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, removeItem, closeCart } = useCart()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#180A10]/30"
          onClick={closeCart}
        />
      )}

      {/* Drawer — flexbox width transition, NOT position:fixed */}
      <aside
        className={`cart-drawer${isOpen ? ' open' : ''} z-40 relative bg-white border-l border-[#F0D4DC] flex flex-col`}
        style={{ minHeight: '100dvh' }}
        aria-label="Carrito de compras"
      >
        {/* Inner wrapper keeps content at fixed 360px even while animating */}
        <div className="flex flex-col h-full" style={{ width: 360 }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0D4DC]">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#180A10]">
              MI CARRITO
              {totalItems > 0 && (
                <span className="ml-2 text-[#C85880]">({totalItems})</span>
              )}
            </h2>
            <button
              onClick={closeCart}
              aria-label="Cerrar carrito"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0D4DC] transition-colors"
            >
              <X size={16} className="text-[#180A10]" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {items.length === 0 ? (
              <p className="text-sm text-[#180A10]/40 text-center mt-10">
                Tu carrito está vacío.
              </p>
            ) : (
              items.map(item => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-3 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-18 rounded-xl overflow-hidden bg-[#F9E8EF] flex-shrink-0 flex items-center justify-center"
                    style={{ height: 72 }}>
                    {item.product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👗</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#180A10] line-clamp-2 leading-snug">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#180A10]/40 border border-[#F0D4DC] rounded px-1.5 py-0.5">
                        {item.size}
                      </span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#F0D4DC] flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[#C85880] font-bold text-sm">
                        S/ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <span className="text-xs text-[#180A10]/30">×{item.quantity}</span>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    aria-label="Eliminar"
                    className="p-1 hover:text-[#C85880] text-[#180A10]/20 transition-colors flex-shrink-0 mt-0.5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#F0D4DC] px-5 py-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#180A10]/50 uppercase tracking-widest">Total</span>
                <span className="text-xl font-bold text-[#180A10]">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3 rounded-full bg-[#C85880] text-white text-sm font-semibold text-center hover:bg-[#a8446a] transition-colors"
              >
                PROCEDER AL PAGO →
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
