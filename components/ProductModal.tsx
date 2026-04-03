'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCart } from '@/context/CartContext'

interface Props {
  product: Product
  isOpen: boolean
  onClose: () => void
}

const COLOR_LABELS: Record<string, string> = {
  '#000000': 'Negro',
  '#ffffff': 'Blanco',
  '#C85880': 'Rosa',
  '#3B5998': 'Azul',
  '#8B4513': 'Marrón',
  '#228B22': 'Verde',
  '#FF6347': 'Rojo',
  '#FFD700': 'Dorado',
}

// Subtle background tint per category for the image area
const CATEGORY_BG: Record<string, string> = {
  vestidos:  '#F9E8EF',
  deportiva: '#E8F0F9',
  casual:    '#F9F3E8',
}

export default function ProductModal({ product, isOpen, onClose }: Props) {
  const { addItem, openCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? '')

  if (!isOpen) return null

  function handleAdd() {
    addItem(product, selectedSize, selectedColor)
    onClose()
    openCart()
  }

  const imgBg = CATEGORY_BG[product.category] ?? '#F0D4DC'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(24,10,16,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-[#F0D0D8] max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close — top-left, circular, semi-transparent */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-[#F0D4DC] transition-colors shadow-sm"
        >
          <X size={16} className="text-[#180A10]" />
        </button>

        {/* EN STOCK badge */}
        <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#C85880] text-white text-[11px] font-bold tracking-wider uppercase">
          EN STOCK
        </div>

        {/* Image — 260px, category-tinted background */}
        <div
          className="w-full flex items-center justify-center overflow-hidden"
          style={{ height: 260, backgroundColor: imgBg }}
        >
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-7xl select-none">👗</span>
          )}
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#180A10] leading-snug">{product.name}</h2>
            <p className="text-[#C85880] font-bold text-2xl mt-1">
              S/ {product.price.toFixed(2)}
            </p>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#180A10]/40 mb-2">Talla</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-[#C85880] bg-[#C85880] text-white'
                      : 'border-[#F0D4DC] text-[#180A10] hover:border-[#C85880]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#180A10]/40 mb-2">
              Color{selectedColor ? ` — ${COLOR_LABELS[selectedColor] ?? selectedColor}` : ''}
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={COLOR_LABELS[color] ?? color}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-[#C85880] scale-110'
                      : 'border-[#F0D4DC] hover:border-[#C85880]'
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #e5c8d0' : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedSize || !selectedColor}
            className="w-full py-3 rounded-full bg-[#C85880] text-white font-semibold text-sm hover:bg-[#a8446a] transition-colors mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            AGREGAR AL CARRITO
          </button>
        </div>
      </div>
    </div>
  )
}
