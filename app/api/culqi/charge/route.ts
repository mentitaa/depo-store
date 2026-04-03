import { NextRequest, NextResponse } from 'next/server'

// Culqi server-side charge
// Docs: https://docs.culqi.com/#/pagos/cobros
export async function POST(req: NextRequest) {
  const { token, amount, email, description } = await req.json()

  if (!token || !amount || !email) {
    return NextResponse.json({ message: 'Parámetros inválidos' }, { status: 400 })
  }

  const secretKey = process.env.CULQI_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: 'Servicio de pago no configurado' }, { status: 500 })
  }

  const res = await fetch('https://api.culqi.com/v2/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount,                    // en centavos (PEN)
      currency_code: 'PEN',
      email,
      source_id: token,
      description: description ?? 'Pedido DEPO',
      capture: true,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const msg = data?.user_message ?? data?.merchant_message ?? 'El pago fue rechazado'
    return NextResponse.json({ message: msg }, { status: 402 })
  }

  return NextResponse.json({ chargeId: data.id }, { status: 200 })
}
