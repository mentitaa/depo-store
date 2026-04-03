'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/supabase'

type PayMethod = 'culqi' | 'yape' | 'efectivo'

// Culqi global injected by the script
declare global {
  interface Window {
    Culqi?: {
      publicKey: string
      settings: (opts: Record<string, unknown>) => void
      open: () => void
      close: () => void
      token?: { id: string }
    }
    culqi?: () => void
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', address: '', reference: '' })
  const [payMethod, setPayMethod] = useState<PayMethod>('culqi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const culqiReady = useRef(false)

  // Load Culqi.js once
  useEffect(() => {
    if (culqiReady.current) return
    const script = document.createElement('script')
    script.src = 'https://checkout.culqi.com/js/v4'
    script.async = true
    script.onload = () => { culqiReady.current = true }
    document.head.appendChild(script)
    return () => {
      // cleanup not strictly needed; script stays for session lifetime
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Called by Culqi after user completes card form
  useEffect(() => {
    window.culqi = async () => {
      const token = window.Culqi?.token
      if (!token) return
      window.Culqi?.close()
      await submitOrders(token.id, 'culqi')
    }
  })

  async function submitOrders(culqiToken?: string, method?: string) {
    setLoading(true)
    setError('')
    try {
      if (culqiToken) {
        // Charge via our API route
        const res = await fetch('/api/culqi/charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: culqiToken,
            amount: Math.round(totalPrice * 100), // centavos
            email: 'cliente@midepo.pe',
            description: `Pedido DEPO — ${form.name}`,
          }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message ?? 'Error al procesar el pago')
        }
      }

      for (const item of items) {
        await createOrder({
          customer_name: form.name,
          phone: `+51${form.phone.replace(/\s/g, '')}`,
          address: form.address,
          reference: form.reference || undefined,
          product_id: item.product.id,
          size: item.size,
          color: item.color,
          status: 'pendiente',
        })
      }

      clearCart()
      router.push('/checkout/confirmacion')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleCulqiOpen() {
    if (!window.Culqi) {
      setError('El módulo de pago no cargó. Recarga la página.')
      return
    }
    window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? ''
    window.Culqi.settings({
      title: 'DEPO',
      currency: 'PEN',
      amount: Math.round(totalPrice * 100),
      description: `Pedido — ${form.name || 'cliente'}`,
    })
    window.Culqi.open()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return

    if (payMethod === 'culqi') {
      handleCulqiOpen()
    } else {
      await submitOrders()
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 py-10 max-w-5xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-[#180A10]/50 hover:text-[#C85880] mb-8 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Volver al catálogo
        </Link>

        <h1 className="text-2xl font-bold text-[#180A10] mb-8">Finalizar pedido</h1>

        {items.length === 0 ? (
          <p className="text-[#180A10]/50 text-sm">Tu carrito está vacío.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* ── LEFT: Order summary ─────────────────────────── */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-[#F0D4DC] p-5 flex flex-col gap-3">
                  <h2 className="text-[11px] font-bold text-[#180A10] uppercase tracking-widest">
                    Resumen del pedido
                  </h2>

                  {items.map(item => (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex items-center gap-3"
                    >
                      {/* Thumb */}
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#F9E8EF] flex-shrink-0 flex items-center justify-center">
                        {item.product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">👗</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#180A10] line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-[#180A10]/40 mt-0.5">
                          Talla {item.size}{item.quantity > 1 ? ` × ${item.quantity}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#180A10] flex-shrink-0">
                        S/ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-3 border-t border-[#F0D4DC]">
                    <span className="text-sm text-[#180A10]/60">Subtotal</span>
                    <span className="text-lg font-bold text-[#C85880]">
                      S/ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[#180A10]/40">
                    Entrega coordinada por WhatsApp después del pedido.
                  </p>
                </div>
              </div>

              {/* ── RIGHT: Form ──────────────────────────────────── */}
              <div className="flex flex-col gap-4">

                {/* Delivery data */}
                <div className="bg-white rounded-2xl border border-[#F0D4DC] p-5 flex flex-col gap-4">
                  <h2 className="text-[11px] font-bold text-[#180A10] uppercase tracking-widest">
                    Datos de entrega
                  </h2>

                  {/* Nombre */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="name">
                      Nombre completo
                    </label>
                    <input
                      id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder="María García"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F0D4DC] text-sm text-[#180A10] bg-[#FFF8FA] focus:outline-none focus:border-[#C85880] transition-colors"
                    />
                  </div>

                  {/* Teléfono con prefijo +51 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="phone">
                      Teléfono (WhatsApp)
                    </label>
                    <div className="flex">
                      <span className="flex items-center px-3 rounded-l-xl border border-r-0 border-[#F0D4DC] bg-[#F0D4DC] text-sm text-[#180A10]/60 font-medium select-none">
                        +51
                      </span>
                      <input
                        id="phone" name="phone" type="tel" required
                        value={form.phone} onChange={handleChange}
                        placeholder="944 123 456"
                        pattern="[0-9\s]{7,12}"
                        className="flex-1 px-4 py-2.5 rounded-r-xl border border-[#F0D4DC] text-sm text-[#180A10] bg-[#FFF8FA] focus:outline-none focus:border-[#C85880] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="address">
                      Dirección en Trujillo
                    </label>
                    <input
                      id="address" name="address" type="text" required
                      value={form.address} onChange={handleChange}
                      placeholder="Av. España 1234, Urb. El Golf"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F0D4DC] text-sm text-[#180A10] bg-[#FFF8FA] focus:outline-none focus:border-[#C85880] transition-colors"
                    />
                  </div>

                  {/* Referencia */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="reference">
                      Referencia <span className="text-[#180A10]/30">(opcional)</span>
                    </label>
                    <input
                      id="reference" name="reference" type="text"
                      value={form.reference} onChange={handleChange}
                      placeholder="Cerca al parque, portón azul…"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F0D4DC] text-sm text-[#180A10] bg-[#FFF8FA] focus:outline-none focus:border-[#C85880] transition-colors"
                    />
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl border border-[#F0D4DC] p-5 flex flex-col gap-3">
                  <h2 className="text-[11px] font-bold text-[#180A10] uppercase tracking-widest">
                    Método de pago
                  </h2>

                  {([
                    { value: 'culqi',    label: 'Tarjeta crédito / débito',  icon: <CreditCard size={16} /> },
                    { value: 'yape',     label: 'Yape / Plin',               icon: <Smartphone size={16} /> },
                    { value: 'efectivo', label: 'Efectivo contra entrega',   icon: <span className="text-base leading-none">💵</span> },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPayMethod(opt.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                        payMethod === opt.value
                          ? 'border-[#C85880] bg-[#FFF0F4] text-[#C85880]'
                          : 'border-[#F0D4DC] text-[#180A10] hover:border-[#C85880]'
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}

                  {payMethod === 'culqi' && (
                    <p className="text-xs text-[#180A10]/40 leading-relaxed">
                      Al confirmar se abrirá el formulario de pago seguro de Culqi (Visa, Mastercard, Amex).
                    </p>
                  )}
                  {payMethod === 'yape' && (
                    <p className="text-xs text-[#180A10]/40 leading-relaxed">
                      Te enviamos el número de Yape/Plin por WhatsApp tras confirmar.
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[#C85880] text-white font-bold text-sm hover:bg-[#a8446a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Procesando…'
                    : payMethod === 'culqi'
                      ? 'PAGAR CON CULQI →'
                      : 'CONFIRMAR PEDIDO →'}
                </button>
              </div>

            </div>
          </form>
        )}
      </main>
    </>
  )
}
