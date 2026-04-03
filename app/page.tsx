import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Catalog from '@/components/Catalog'
import { getProducts } from '@/lib/supabase'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function HomePage() {
  let products: Product[] = []
  try {
    products = await getProducts()
  } catch {
    // Supabase no disponible en build time — Catalog usa DEMO_PRODUCTS como fallback
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Catalog initialProducts={products} />
      </main>
    </>
  )
}
