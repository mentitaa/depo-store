'use client'

import type { Product } from '@/lib/types'
import { useCart } from '@/context/CartContext'

interface Props {
  product: Product
  onClick: () => void
}

/** Parse "YYYY-MM-DD" → "dd/mm" without timezone issues */
function formatDate(dateStr: string): string {
  const parts = dateStr.split('-')
  return `${parts[2]}/${parts[1]}`
}

/** Compare date-only strings "YYYY-MM-DD" with today */
function isDateFuture(dateStr: string): boolean {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return dateStr > todayStr
}

export default function ProductCard({ product, onClick }: Props) {
  const { addItem, openCart } = useCart()
  const isFuture = product.available_from ? isDateFuture(product.available_from) : false

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation()
    addItem(product, product.sizes[0] ?? '', product.colors[0] ?? '')
    openCart()
  }

  return (
    <div
      onClick={isFuture ? undefined : onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F0D4DC] text-left transition-all duration-200 hover:border-[#C85880] hover:shadow-md relative"
      style={{
        pointerEvents: isFuture ? 'none' : 'auto',
        cursor: isFuture ? 'default' : 'pointer',
      }}
    >
      {/* Image */}
      <div
        className="w-full overflow-hidden flex items-center justify-center relative"
        style={{ height: 280, background: isFuture ? '#F5F0FA' : '#FFF8FA' }}
      >
        {product.image_urls?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            style={{
              objectFit: 'contain',
              filter: isFuture ? 'blur(1.5px)' : 'none',
            }}
          />
        ) : (
          <span
            className="text-5xl transition-transform duration-300 group-hover:scale-105"
            style={{ filter: isFuture ? 'blur(1.5px)' : 'none' }}
          >
            👗
          </span>
        )}

        {/* Future badge — centered overlay */}
        {isFuture && product.available_from && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: 'none' }}
          >
            <div
              style={{
                background: '#C85880',
                borderRadius: 12,
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.8)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                disponible el
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.1,
                }}
              >
                {formatDate(product.available_from)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 flex flex-col gap-1">
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
            {(Array.isArray(product.category)
              ? product.category
              : typeof product.category === 'string' && (product.category as string).startsWith('[')
                ? JSON.parse(product.category as string)
                : [product.category].filter(Boolean)
            ).join(', ')}
          </span>
        </div>

        <p className="text-sm font-semibold text-[#180A10] leading-snug line-clamp-1">{product.name}</p>

        {/* Sizes + colors */}
        <div className="flex items-center gap-1 flex-wrap">
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
          }}
        >
          S/ {product.price.toFixed(2)}
        </p>

      </div>

      {/* Quick-add button OR próximamente pill */}
      {isFuture ? (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: '#F5F0FA',
            border: '1px solid #E0D0EC',
            borderRadius: 999,
            padding: '4px 10px',
          }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
              fontSize: 10,
              fontWeight: 700,
              color: '#9B7EC0',
              letterSpacing: '0.04em',
            }}
          >
            próximamente
          </span>
        </div>
      ) : (
        <button
          onClick={handleQuickAdd}
          aria-label="Agregar al carrito"
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 32,
            height: 32,
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke="#C85880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
            <line x1="3" y1="6" x2="21" y2="6" stroke="#C85880" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="12" y1="11" x2="12" y2="17" stroke="#C85880" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="9" y1="14" x2="15" y2="14" stroke="#C85880" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
