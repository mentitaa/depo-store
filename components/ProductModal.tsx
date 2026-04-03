'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
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

const CATEGORY_BG: Record<string, string> = {
  vestidos:  '#F9E8EF',
  deportiva: '#E8F0F9',
  casual:    '#F9F3E8',
}

export default function ProductModal({ product, isOpen, onClose }: Props) {
  const { addItem, openCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? '')
  const [imgIndex, setImgIndex] = useState(0)

  if (!isOpen) return null

  function handleAdd() {
    addItem(product, selectedSize, selectedColor)
    onClose()
    openCart()
  }

  const images = product.image_urls ?? []
  const imgBg = CATEGORY_BG[product.category] ?? '#F0D4DC'

  function prev() {
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }
  function next() {
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }

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
        {/* Close */}
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

        {/* Image carousel */}
        <div
          className="w-full flex items-center justify-center overflow-hidden relative"
          style={{ height: 340, backgroundColor: '#FFF8FA' }}
        >
          {images.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[imgIndex]}
                alt={`${product.name} ${imgIndex + 1}`}
                className="w-full h-full"
                style={{ objectFit: 'contain' }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft size={16} className="text-[#180A10]" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight size={16} className="text-[#180A10]" />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        aria-label={`Ver imagen ${i + 1}`}
                        style={{
                          width: i === imgIndex ? 16 : 6,
                          height: 6,
                          borderRadius: 3,
                          background: i === imgIndex ? '#C85880' : 'rgba(255,255,255,0.7)',
                          transition: 'all 0.2s',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-7xl select-none">👗</span>
          )}
        </div>

        {/* Details */}
        <div className="p-5 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#180A10] leading-snug">{product.name}</h2>

          {/* Sizes + colors + price in one row */}
          <div className="flex items-center gap-3">
            {/* Sizes */}
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#180A10]/40">Talla</p>
              <div className="flex gap-1.5 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
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
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#180A10]/40">
                Color
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={COLOR_LABELS[color] ?? color}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
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
