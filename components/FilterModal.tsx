'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const PALETTE = [
  { value: '#000000', label: 'Negro' },
  { value: '#ffffff', label: 'Blanco' },
  { value: '#C85880', label: 'Rosa' },
  { value: '#3B5998', label: 'Azul' },
  { value: '#8B4513', label: 'Marrón' },
  { value: '#228B22', label: 'Verde' },
  { value: '#FF6347', label: 'Rojo' },
  { value: '#FFD700', label: 'Dorado' },
]

export interface FilterValues {
  sizes: string[]
  colors: string[]
}

interface Props {
  initial: FilterValues
  onApply: (f: FilterValues) => void
  onClose: () => void
}

export default function FilterModal({ initial, onApply, onClose }: Props) {
  const [sizes, setSizes] = useState<string[]>(initial.sizes)
  const [colors, setColors] = useState<string[]>(initial.colors)

  function toggleSize(s: string) {
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  function toggleColor(c: string) {
    setColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  function handleClear() {
    setSizes([])
    setColors([])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(24,10,16,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-[#F0D0D8] max-w-sm w-full p-6 flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header — title centered, X top-right */}
        <div className="relative flex items-center justify-center">
          <h2 className="text-base font-bold text-[#180A10] tracking-[0.15em] uppercase">
            FILTROS
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0D4DC] transition-colors"
          >
            <X size={16} className="text-[#180A10]" />
          </button>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#180A10]/40 mb-3">Talla</p>
          <div className="flex gap-2 flex-wrap">
            {ALL_SIZES.map(s => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  sizes.includes(s)
                    ? 'border-[#C85880] bg-[#C85880] text-white'
                    : 'border-[#F0D4DC] text-[#180A10] hover:border-[#C85880]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors — 26px circles */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#180A10]/40 mb-3">Color</p>
          <div className="flex gap-3 flex-wrap">
            {PALETTE.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => toggleColor(value)}
                title={label}
                style={{
                  width: 26,
                  height: 26,
                  backgroundColor: value,
                  boxShadow: value === '#ffffff' ? 'inset 0 0 0 1px #e5c8d0' : undefined,
                }}
                className={`rounded-full border-2 transition-all flex-shrink-0 ${
                  colors.includes(value)
                    ? 'border-[#C85880] scale-110'
                    : 'border-[#F0D4DC] hover:border-[#C85880]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-full border border-[#F0D4DC] text-[#180A10] text-sm font-medium hover:border-[#C85880] transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={() => { onApply({ sizes, colors }); onClose() }}
            className="flex-1 py-2.5 rounded-full bg-[#C85880] text-white text-sm font-semibold hover:bg-[#a8446a] transition-colors"
          >
            VER RESULTADOS
          </button>
        </div>
      </div>
    </div>
  )
}
