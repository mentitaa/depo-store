'use client'

import type { Product } from '@/lib/types'
import { useCart } from '@/context/CartContext'

interface Props {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  const { addItem, openCart } = useCart()

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (product.stock === 0) return
    addItem(product, product.sizes[0] ?? '', product.colors[0] ?? '')
    openCart()
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F0D4DC] text-left transition-all duration-200 hover:border-[#C85880] hover:shadow-md cursor-pointer relative"
    >
      {/* Image — 280px fixed, contain */}
      <div className="w-full overflow-hidden flex items-center justify-center relative" style={{ height: 280, background: '#FFF8FA' }}>
        {product.image_urls?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <span className="text-5xl transition-transform duration-300 group-hover:scale-105">👗</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-[#180A10]/50 uppercase tracking-widest">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#C85880',
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
              fontWeight: 700,
              fontSize: 10,
              color: '#C85880',
              textTransform: 'lowercase' as const,
            }}
          >
            {(Array.isArray(product.category) ? product.category : [product.category].filter(Boolean)).join(' · ')}
          </span>
        </div>

        <p className="text-sm font-semibold text-[#180A10] leading-snug line-clamp-1">{product.name}</p>

        {/* Sizes + colors + price + "+" button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
            {product.sizes.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] text-[#180A10]/40 border border-[#F0D4DC] rounded px-1 py-0.5 leading-none">
                {s}
              </span>
            ))}
            {product.colors.slice(0, 3).map(c => (
              <span
                key={c}
                className="w-3 h-3 rounded-full border border-[#F0D4DC] flex-shrink-0"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Price */}
          <p
            style={{
              fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
              fontWeight: 700,
              fontSize: 20,
              color: '#C85880',
              flexShrink: 0,
            }}
          >
            S/ {product.price.toFixed(2)}
          </p>

        </div>
      </div>

      {/* Floating quick-add button — bottom-right corner */}
      {product.stock > 0 && (
        <button
          onClick={handleQuickAdd}
          aria-label="Agregar al carrito"
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #F0D4DC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#C85880'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 3px 10px rgba(200,88,128,0.25)'
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#F0D4DC'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            {/* Cart body */}
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke="#C85880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#C85880" strokeWidth="1.8" strokeLinecap="round"/>
            {/* Plus sign */}
            <line x1="12" y1="11" x2="12" y2="17" stroke="#C85880" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="9" y1="14" x2="15" y2="14" stroke="#C85880" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
