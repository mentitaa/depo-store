'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Navbar from '@/components/Navbar'

const FAQS = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Te lo entregamos el mismo día. Te contactaremos por WhatsApp y coordinamos la entrega.',
  },
  {
    q: '¿Hacen envíos fuera de Trujillo?',
    a: 'Sí, a pueblos y ciudades cercanas. En esos casos tomará 1 día adicional.',
  },
  {
    q: '¿Puedo hacer devoluciones?',
    a: 'No aceptamos devoluciones.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Con tarjeta mediante Culqi, o con Yape, Plin o Dale. No se aceptan pagos contra entrega.',
  },
  {
    q: '¿El precio incluye el envío?',
    a: 'No. Al coordinar la entrega, el pedido se enviará mediante un motorizado de InDriver y pagarás el envío al recibir tu pedido.',
  },
]

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[#F0D4DC] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-[#FFF0F4] transition-colors"
      >
        <span className="text-sm font-semibold text-[#180A10]">{q}</span>
        <ChevronDown
          size={18}
          className="text-[#C85880] flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-[#180A10]/60 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl font-bold text-[#180A10] mb-2">Preguntas frecuentes</h1>
        <p className="text-sm text-[#180A10]/40 mb-8">Todo lo que necesitas saber antes de comprar.</p>

        <div className="flex flex-col gap-3">
          {FAQS.map(faq => (
            <Accordion key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </main>
    </>
  )
}
