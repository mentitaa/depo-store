'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Te lo entregamos el mismo día. Te contactaremos por WhatsApp y coordinamos la entrega.',
  },
  {
    q: '¿Hacen envíos fuera de Trujillo?',
    a: (
      <span>
        Sí. Hacemos envíos a las siguientes zonas:<br /><br />
        <span style={{ display: 'block', marginBottom: 6 }}>
          <strong>Trujillo y alrededores (mismo día):</strong> Huanchaco, El Milagro, Florencia de Mora, Víctor Larco y Moche.
        </span>
        <span style={{ display: 'block', marginBottom: 6 }}>
          <strong>Valle y provincia (1-2 días vía Tres Ases o Shalom):</strong> Virú, Otuzco, Chocope, Casa Grande, Paiján, Ascope, Pacasmayo y San Pedro de Lloc.
        </span>
        ¿No ves tu ciudad? Escríbenos por WhatsApp y coordinamos.
      </span>
    ),
  },
  {
    q: '¿Puedo hacer devoluciones?',
    a: 'Cada prenda pasa por revisión antes de salir. No encontrarás fallas — pero si en algún caso excepcional ocurre algo, lo coordinamos contigo en privado. Por temas de gusto o decisión de compra, no realizamos devoluciones.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Con tarjeta mediante Culqi, o con Yape, Plin o Dale. No se aceptan pagos contra entrega.',
  },
  {
    q: '¿El precio incluye el envío?',
    a: (
      <span>
        No. El envío se cobra aparte según tu ubicación:<br /><br />
        <span style={{ display: 'block', marginBottom: 6 }}>
          <strong>Trujillo y alrededores:</strong> el pedido llega mediante un motorizado de InDriver y pagas el costo del envío al recibirlo.
        </span>
        <strong>Valle y provincia:</strong> enviamos por Tres Ases o Shalom bajo la modalidad &quot;paga el destinatario&quot;, es decir, cancelas el envío directamente al recoger tu paquete en la agencia.
      </span>
    ),
  },
]

function FaqRow({ q, a, last }: { q: string; a: React.ReactNode; last: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={last ? '' : 'border-b border-[#F0D4DC]'}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between px-6 py-4 text-left gap-4 hover:bg-[#FFF8FA] transition-colors"
      >
        <span
          className="text-sm text-[#180A10]"
          style={{ fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace' }}
        >
          <span className="text-[#C85880] mr-2 select-none">›</span>
          {q}
        </span>
        <span
          className="text-[#C85880] text-lg leading-none flex-shrink-0 transition-transform duration-200 mt-0.5"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}
        >
          ›
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5">
          <div
            className="text-sm leading-relaxed"
            style={{ color: '#C85880' }}
          >
            {a}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-start justify-center px-4 py-12 bg-[#FFF8FA]">
        <div
          className="w-full overflow-hidden"
          style={{
            maxWidth: 680,
            background: '#ffffff',
            border: '1px solid #F0D4DC',
            borderRadius: 16,
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ background: '#180A10' }}
          >
            {/* Blinking dot */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#C85880',
                flexShrink: 0,
                animation: 'blink 1.2s step-start infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                fontSize: 13,
                color: '#C85880',
                letterSpacing: '0.03em',
              }}
            >
              // ¿tienes dudas?
            </span>
          </div>

          {/* FAQ rows */}
          <div>
            {FAQS.map((faq, i) => (
              <FaqRow key={faq.q} q={faq.q} a={faq.a} last={i === FAQS.length - 1} />
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  )
}
