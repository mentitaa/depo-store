'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

function Logo() {
  return (
    <Link href="/" className="flex items-center select-none" style={{ height: 40 }}>
      <span
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: '0.04em',
          color: '#180A10',
          lineHeight: 1,
        }}
      >
        Mi DEPO
      </span>
      <span style={{ fontSize: 26, marginLeft: 7, lineHeight: 1 }}>📦</span>
    </Link>
  )
}

export default function Navbar() {
  const { totalItems, openCart } = useCart()

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 bg-[#FFF8FA] border-b border-[#F0D4DC]"
      style={{ height: 56, backdropFilter: 'blur(8px)' }}
    >
      <Logo />

      <div className="flex items-center gap-4">
        <Link
          href="/faq"
          className="text-sm text-[#180A10]/50 hover:text-[#C85880] transition-colors hidden sm:block"
        >
          FAQ
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
