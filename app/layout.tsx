import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'DEPO — Ropa femenina en Trujillo',
  description: 'Tienda de ropa femenina con stock disponible ya en Trujillo, Perú.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh">
        <CartProvider>
          {/* Flex row so the CartDrawer slides from the right without position:fixed */}
          <div className="flex min-h-dvh">
            <div className="flex-1 min-w-0 flex flex-col">
              {children}
            </div>
            <CartDrawer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
