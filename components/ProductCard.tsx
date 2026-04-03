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
      {/* Image */}
      <div className="w-full aspect-[3/4] bg-[#F0D4DC] overflow-hidden flex items-center justify-center relative">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      <div className="p-3 flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#180A10] leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-1 flex-wrap">
          {product.sizes.slice(0, 4).map(s => (
            <span key={s} className="text-[10px] text-[#180A10]/40 border border-[#F0D4DC] rounded px-1 py-0.5">
              {s}
            </span>
          ))}
        </div>
        {/* Color dots */}
        <div className="flex gap-1 mt-0.5">
          {product.colors.slice(0, 5).map(c => (
            <span
              key={c}
              className="w-3.5 h-3.5 rounded-full border border-[#F0D4DC]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <p className="text-[#C85880] font-bold text-base mt-1">S/ {product.price.toFixed(2)}</p>
      </div>
    </button>
  )
}
