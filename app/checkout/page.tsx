'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/supabase'

type PayMethod = 'culqi' | 'yape'

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
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', reference: '' })
  const [payMethod, setPayMethod] = useState<PayMethod>('culqi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const culqiReady = useRef(false)

  // Redirect to home if cart empties while on this page
  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items.length, router])

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
            email: form.email,
            description: `Pedido Anora — ${form.name}`,
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
          customer_email: form.email || undefined,
          phone: `+51${form.phone.replace(/\s/g, '')}`,
          address: form.address,
          reference: form.reference || undefined,
          product_id: item.product.id,
          size: item.size,
          color: item.color,
          status: 'pendiente',
        })
      }

      // Send confirmation email
      fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order_confirmed',
            to: form.email,
            customerName: form.name,
            items: items.map(i => ({
              name: i.product.name,
              size: i.size,
              color: i.color,
              quantity: i.quantity,
              price: i.product.price,
            })),
            total: totalPrice,
            address: form.address,
          }),
        }).catch(err => console.error('[Checkout] Email error:', err))

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
      title: 'Anora',
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
                        {item.product.image_urls?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.image_urls[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">👗</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-sm font-semibold text-[#180A10] line-clamp-1 flex-1">{item.product.name}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id, item.size, item.color)}
                            aria-label="Eliminar producto"
                            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                          >
                            <X size={12} className="text-[#180A10]/30 hover:text-red-400" />
                          </button>
                        </div>
                        <p className="text-xs text-[#180A10]/40 mt-0.5">Talla {item.size}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="w-5 h-5 rounded-full border border-[#F0D4DC] flex items-center justify-center text-[#180A10]/50 hover:border-[#C85880] hover:text-[#C85880] transition-colors text-xs font-bold leading-none"
                            >−</button>
                            <span className="text-xs font-semibold text-[#180A10] w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="w-5 h-5 rounded-full border border-[#F0D4DC] flex items-center justify-center text-[#180A10]/50 hover:border-[#C85880] hover:text-[#C85880] transition-colors text-xs font-bold leading-none"
                            >+</button>
                          </div>
                          <span className="text-sm font-bold text-[#C85880] flex-shrink-0">
                            S/ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
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

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="email">
                      Correo electrónico
                    </label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="maria@gmail.com"
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

                  {/* Two-card grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                    {/* Card: Billeteras digitales */}
                    <button
                      type="button"
                      onClick={() => setPayMethod('yape')}
                      style={{
                        border: `1px solid ${payMethod === 'yape' ? '#C85880' : '#F0D4DC'}`,
                        background: payMethod === 'yape' ? '#FFF0F4' : '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 0.15s, background 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#180A10', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Billeteras digitales
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/yape.png" alt="Yape" style={{ height: 28, width: 'auto', objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'inline' }} />
                        <span style={{ display: 'none', fontSize: 12, fontWeight: 700, color: '#180A10' }}>Yape</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/plin.png" alt="Plin" style={{ height: 28, width: 'auto', objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'inline' }} />
                        <span style={{ display: 'none', fontSize: 12, fontWeight: 700, color: '#180A10' }}>Plin</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://framerusercontent.com/assets/8av9TNXdPFFLbMXZqnzGQfAg3g.svg" alt="Dale" style={{ height: 28, width: 'auto', objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'inline' }} />
                        <span style={{ display: 'none', fontSize: 12, fontWeight: 700, color: '#180A10' }}>Dale</span>
                      </div>
                    </button>

                    {/* Card: Tarjeta crédito/débito */}
                    <button
                      type="button"
                      onClick={() => setPayMethod('culqi')}
                      style={{
                        border: `1px solid ${payMethod === 'culqi' ? '#C85880' : '#F0D4DC'}`,
                        background: payMethod === 'culqi' ? '#FFF0F4' : '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 0.15s, background 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#180A10', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Tarjeta crédito / débito
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: 24, width: 'auto', objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'inline' }} />
                        <span style={{ display: 'none', fontSize: 12, fontWeight: 700, color: '#180A10' }}>Visa</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: 24, width: 'auto', objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'inline' }} />
                        <span style={{ display: 'none', fontSize: 12, fontWeight: 700, color: '#180A10' }}>Mastercard</span>
                      </div>
                    </button>
                  </div>

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
                      : 'CONFIRMAR PEDIDO →'
                  }
                </button>
              </div>

            </div>
          </form>
        )}
      </main>
    </>
  )
}
