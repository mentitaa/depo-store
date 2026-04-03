import Link from 'next/link'

export default function ConfirmacionPage() {
  return (
    <main className="min-h-dvh bg-[#FFF8FA] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="text-6xl select-none">🎉</div>
      <h1 className="text-2xl font-bold text-[#180A10]">¡Pedido confirmado!</h1>
      <p className="text-[#180A10]/60 max-w-xs text-sm leading-relaxed">
        Recibimos tu pedido. Nos comunicamos contigo por WhatsApp para coordinar la entrega en Trujillo.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full bg-[#C85880] text-white font-semibold text-sm hover:bg-[#a8446a] transition-colors"
      >
        Seguir comprando
      </Link>
    </main>
  )
}
