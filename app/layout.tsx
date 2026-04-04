import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import PoweredBy from '@/components/PoweredBy'

export const metadata: Metadata = {
  title: 'Anora✨ — Ropa femenina en Trujillo',
  description: 'Sin esperas, lo que ves, lo tienes hoy. Ropa femenina con entrega inmediata en Trujillo, Perú.',
  openGraph: {
    title: 'Anora✨ — Ropa femenina en Trujillo',
    description: 'Sin esperas, lo que ves, lo tienes hoy.',
    url: 'https://anora.vercel.app',
    siteName: 'Anora',
    locale: 'es_PE',
    type: 'website',
  },
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
