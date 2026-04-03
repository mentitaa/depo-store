import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Catalog from '@/components/Catalog'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Catalog />
      </main>
    </>
  )
}
