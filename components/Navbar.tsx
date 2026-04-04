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
      className="sticky top-0 z-40 flex items-center justify-between bg-[#FFF8FA] border-b border-[#F0D4DC]"
      style={{ height: 52, padding: '0 16px', backdropFilter: 'blur(8px)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center select-none flex-shrink-0" style={{ gap: 4 }}>
        <span style={{ ...MONO, fontWeight: 700, fontSize: 15, color: '#180A10', lineHeight: 1, whiteSpace: 'nowrap' }}>
          Mi DEPO📦
        </span>
      </Link>

      {/* Right: FAQ + cart */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <Link
          href="/faq"
          className="hidden sm:block transition-opacity hover:opacity-70 flex-shrink-0"
          style={{ ...MONO, fontSize: 13, fontWeight: 700, color: '#C85880', whiteSpace: 'nowrap' }}
        >
          // ¿tienes dudas?
        </Link>

        <button
          onClick={openCart}
          className="flex items-center gap-1.5 rounded-full border border-[#F0D4DC] bg-white text-[#180A10] font-medium hover:border-[#C85880] hover:text-[#C85880] transition-colors flex-shrink-0"
          style={{ fontSize: 13, padding: '6px 12px' }}
        >
          <ShoppingBag size={14} />
          <span style={{ whiteSpace: 'nowrap' }}>carrito ({totalItems})</span>
        </button>
      </div>
    </nav>
  )
}
