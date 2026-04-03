'use client'

import Link from 'next/link'
import { X, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, removeItem, closeCart } = useCart()

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer — position fixed, slides in from right */}
      <aside
        aria-label="Carrito de compras"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 360,
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          background: '#ffffff',
          borderLeft: '1px solid #F0D4DC',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
          {/* ── Header (fixed top) ───────────────────────────── */}
          <div
            className="flex items-center justify-between px-5 border-b border-[#F0D4DC]"
            style={{ height: 56, flexShrink: 0 }}
          >
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

          {/* ── Items (scrollable middle) ─────────────────────── */}
          <div
            className="px-5 py-4 flex flex-col gap-4"
            style={{ flex: 1, overflowY: 'auto' }}
          >
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
                  <div
                    className="rounded-xl overflow-hidden bg-[#F9E8EF] flex-shrink-0 flex items-center justify-center"
                    style={{ width: 56, height: 72 }}
                  >
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

          {/* ── Footer (fixed bottom, always visible) ─────────── */}
          <div
            className="border-t border-[#F0D4DC] px-5 py-5 flex flex-col gap-3 bg-white"
            style={{ flexShrink: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#180A10]/50 uppercase tracking-widest">Total</span>
              <span className="text-xl font-bold text-[#180A10]">
                S/ {totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className={`w-full py-3 rounded-full text-sm font-semibold text-center transition-colors ${
                items.length > 0
                  ? 'bg-[#C85880] text-white hover:bg-[#a8446a]'
                  : 'bg-[#F0D4DC] text-[#180A10]/30 pointer-events-none'
              }`}
            >
              PROCEDER AL PAGO →
            </Link>
          </div>
      </aside>
    </>
  )
}
