'use client'

import type { Product } from '@/lib/types'

interface Props {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F0D4DC] text-left transition-all duration-200 hover:border-[#C85880] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85880]"
    >
      {/* Image — fixed 220px height */}
      <div className="w-full bg-[#F0D4DC] overflow-hidden flex items-center justify-center relative" style={{ height: 220 }}>
        {product.image_urls?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            style={{ objectFit: 'cover' }}
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
            {product.category}
          </span>
        </div>

        <p className="text-sm font-semibold text-[#180A10] leading-snug line-clamp-1">{product.name}</p>

        {/* Sizes + colors + price in one row */}
        <div className="flex items-center gap-2">
          {/* Sizes */}
          <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
            {product.sizes.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] text-[#180A10]/40 border border-[#F0D4DC] rounded px-1 py-0.5 leading-none">
                {s}
              </span>
            ))}
            {/* Color dots */}
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
              fontSize: 14,
              color: '#C85880',
              flexShrink: 0,
            }}
          >
            S/ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </button>
  )
}
