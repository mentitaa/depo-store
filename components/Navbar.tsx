'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { totalItems, openCart } = useCart()

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#FFF8FA] border-b border-[#F0D4DC]"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <Link href="/">
        <span
          className="text-2xl tracking-[0.3em] uppercase text-[#180A10] select-none"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          DEPO
        </span>
      </Link>

      <button
        onClick={openCart}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#F0D4DC] bg-white text-[#180A10] text-sm font-medium hover:border-[#C85880] hover:text-[#C85880] transition-colors"
      >
        <ShoppingBag size={16} />
        <span>carrito ({totalItems})</span>
      </button>
    </nav>
  )
}
