'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import FilterModal, { type FilterValues } from './FilterModal'

const CATEGORIES: { label: string; value: Category | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Vestidos', value: 'vestidos' },
  { label: 'Deportiva', value: 'deportiva' },
  { label: 'Casual', value: 'casual' },
]

// Demo products so the page renders without Supabase connected
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Primavera',
    category: 'vestidos',
    price: 89.90,
    sizes: ['S', 'M', 'L'],
    colors: ['#C85880', '#ffffff', '#FFD700'],
    image_url: '',
    stock: 5,
    created_at: '',
  },
  {
    id: '2',
    name: 'Set Deportivo Premium',
    category: 'deportiva',
    price: 120.00,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#000000', '#C85880', '#3B5998'],
    image_url: '',
    stock: 3,
    created_at: '',
  },
  {
    id: '3',
    name: 'Blusa Casual Lino',
    category: 'casual',
    price: 55.50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffffff', '#FFD700', '#8B4513'],
    image_url: '',
    stock: 8,
    created_at: '',
  },
  {
    id: '4',
    name: 'Mini Vestido Satinado',
    category: 'vestidos',
    price: 110.00,
    sizes: ['XS', 'S', 'M'],
    colors: ['#000000', '#C85880'],
    image_url: '',
    stock: 2,
    created_at: '',
  },
  {
    id: '5',
    name: 'Jogger Oversize',
    category: 'deportiva',
    price: 75.00,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#228B22', '#3B5998'],
    image_url: '',
    stock: 6,
    created_at: '',
  },
  {
    id: '6',
    name: 'Camisa Oversized Casual',
    category: 'casual',
    price: 65.00,
    sizes: ['M', 'L', 'XL'],
    colors: ['#ffffff', '#8B4513', '#3B5998'],
    image_url: '',
    stock: 4,
    created_at: '',
  },
]

interface Props {
  initialProducts?: Product[]
}

export default function Catalog({ initialProducts = DEMO_PRODUCTS }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | 'todos'>('todos')
  const [filters, setFilters] = useState<FilterValues>({ sizes: [], colors: [] })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = initialProducts.filter(p => {
    if (activeCategory !== 'todos' && p.category !== activeCategory) return false
    if (filters.sizes.length > 0 && !filters.sizes.some(s => p.sizes.includes(s))) return false
    if (filters.colors.length > 0 && !filters.colors.some(c => p.colors.includes(c))) return false
    return true
  })

  const hasActiveFilters = filters.sizes.length > 0 || filters.colors.length > 0

  const MONO = 'ui-monospace, "Cascadia Code", "Fira Code", monospace'

  return (
    <section id="catalogo" className="px-4 sm:px-6 pb-16">
      {/* Card container */}
      <div
        style={{
          border: '1px solid #F0D4DC',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 0,
        }}
      >
        {/* Dark header */}
        <div
          style={{
            background: '#180A10',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#C85880',
                display: 'inline-block',
                animation: 'blink 1.2s step-start infinite',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 13,
                color: '#C85880',
              }}
            >
              // catalogo.filter()
            </span>
          </div>

          {/* Filtrar button */}
          <button
            onClick={() => setShowFilters(true)}
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 12,
              color: hasActiveFilters ? '#ffffff' : '#C85880',
              background: hasActiveFilters ? '#C85880' : 'transparent',
              border: `1px solid ${hasActiveFilters ? '#C85880' : '#3A1A24'}`,
              borderRadius: 6,
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={12} />
            filtrar()
            {hasActiveFilters && (
              <span
                style={{
                  background: '#ffffff',
                  color: '#C85880',
                  borderRadius: '50%',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {filters.sizes.length + filters.colors.length}
              </span>
            )}
          </button>
        </div>

        {/* Category buttons */}
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap' as const,
            borderBottom: '1px solid #F0D4DC',
            background: '#ffffff',
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 12,
                padding: '5px 14px',
                borderRadius: 6,
                border: activeCategory === cat.value ? '1px solid #C85880' : '1px solid #F0D4DC',
                background: activeCategory === cat.value ? '#C85880' : '#ffffff',
                color: activeCategory === cat.value ? '#ffffff' : '#180A10',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat.label.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ padding: '16px', background: '#ffffff' }}>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#180A10]/40 text-sm">
              No hay productos con estos filtros.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {showFilters && (
        <FilterModal
          initial={filters}
          onApply={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </section>
  )
}
