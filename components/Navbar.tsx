'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const MONO: React.CSSProperties = {
  fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
}

export default function Navbar() {
  const { totalItems, openCart } = useCart()

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 bg-[#FFF8FA] border-b border-[#F0D4DC]"
      style={{ height: 56, backdropFilter: 'blur(8px)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 select-none" style={{ height: 40 }}>
        <span style={{ ...MONO, fontWeight: 700, fontSize: 15, color: '#180A10', lineHeight: 1 }}>
          Mi DEPO
        </span>
        <span style={{ fontSize: 17, lineHeight: 1 }}>📦</span>
      </Link>

      {/* Right: FAQ + cart */}
      <div className="flex items-center gap-4">
        <Link
          href="/faq"
          className="hidden sm:block transition-opacity hover:opacity-70"
          style={{ ...MONO, fontSize: 13, fontWeight: 700, color: '#C85880' }}
        >
          // ¿tienes dudas?
        </Link>

        <button
          onClick={openCart}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#F0D4DC] bg-white text-[#180A10] text-sm font-medium hover:border-[#C85880] hover:text-[#C85880] transition-colors"
        >
          <ShoppingBag size={16} />
          <span>carrito ({totalItems})</span>
        </button>
      </div>
    </nav>
  )
}
