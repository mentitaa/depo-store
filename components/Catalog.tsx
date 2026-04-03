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

  return (
    <section id="catalogo" className="px-4 sm:px-6 pb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[#180A10] tracking-tight">Catálogo</h2>
        <button
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
            hasActiveFilters
              ? 'border-[#C85880] bg-[#C85880] text-white'
              : 'border-[#F0D4DC] text-[#180A10] hover:border-[#C85880]'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filtrar
          {hasActiveFilters && (
            <span className="ml-0.5 bg-white text-[#C85880] rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
              {filters.sizes.length + filters.colors.length}
            </span>
          )}
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat.value
                ? 'bg-[#180A10] text-white border-[#180A10]'
                : 'bg-white text-[#180A10] border-[#F0D4DC] hover:border-[#C85880]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
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
