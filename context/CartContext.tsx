'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { CartItem, Product } from '@/lib/types'

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Product, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.size === size && i.color === color
      )
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, size, color, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems(prev =>
      prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
