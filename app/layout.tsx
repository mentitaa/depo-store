import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import PoweredBy from '@/components/PoweredBy'

export const metadata: Metadata = {
  title: 'Anora — Ropa femenina en Trujillo',
  description: 'Tienda de ropa femenina con stock disponible ya en Trujillo, Perú.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh">
        <CartProvider>
          <div className="flex flex-col min-h-dvh">
            {children}
            <PoweredBy />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
