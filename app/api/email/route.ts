import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const FROM = 'Anora✨ <onboarding@resend.dev>'

export type EmailType = 'order_confirmed' | 'order_shipped' | 'order_cancelled'

interface OrderEmailPayload {
  type: EmailType
  to: string
  customerName: string
  items: { name: string; size: string; color: string; quantity: number; price: number }[]
  total: number
  address?: string
}

function itemsHtml(items: OrderEmailPayload['items']) {
  return items.map(i =>
    `<tr>
      <td style="padding:6px 0;border-bottom:1px solid #F0D4DC;font-size:14px;color:#180A10">${i.name}</td>
      <td style="padding:6px 0;border-bottom:1px solid #F0D4DC;font-size:13px;color:#180A10;opacity:0.6;text-align:center">Talla ${i.size}${i.quantity > 1 ? ` ×${i.quantity}` : ''}</td>
      <td style="padding:6px 0;border-bottom:1px solid #F0D4DC;font-size:14px;color:#C85880;font-weight:700;text-align:right">S/ ${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('')
}

function baseTemplate(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF8FA;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border:1px solid #F0D4DC;border-radius:16px;overflow:hidden">
    <div style="background:#180A10;padding:24px 28px">
      <span style="font-family:ui-monospace,'Cascadia Code','Fira Code',monospace;font-weight:700;font-size:22px;color:#ffffff">Anora✨</span>
    </div>
    <div style="padding:28px">
      <h1 style="margin:0 0 16px;font-size:20px;color:#180A10">${title}</h1>
      ${body}
    </div>
    <div style="padding:16px 28px;border-top:1px solid #F0D4DC;text-align:center">
      <span style="font-size:12px;color:#180A10;opacity:0.4">Anora — Ropa femenina en Trujillo, Perú</span>
    </div>
  </div>
</body>
</html>`
}

function confirmedHtml(p: OrderEmailPayload) {
  return baseTemplate('¡Tu pedido está confirmado! 🎉', `
    <p style="font-size:14px;color:#180A10;margin:0 0 20px">Hola <strong>${p.customerName}</strong>, recibimos tu pedido. Pronto nos pondremos en contacto para coordinar la entrega.</p>
    <table style="width:100%;border-collapse:collapse">
      ${itemsHtml(p.items)}
      <tr><td colspan="2" style="padding:10px 0 0;font-size:13px;color:#180A10;opacity:0.5">Total</td><td style="padding:10px 0 0;font-size:18px;font-weight:700;color:#C85880;text-align:right">S/ ${p.total.toFixed(2)}</td></tr>
    </table>
    ${p.address ? `<p style="margin:20px 0 0;font-size:13px;color:#180A10;opacity:0.6">📍 Dirección: ${p.address}</p>` : ''}
    <p style="margin:20px 0 0;font-size:13px;color:#180A10;opacity:0.6">Te contactaremos por WhatsApp para coordinar la entrega. ¡Gracias por confiar en Anora! 💕</p>
  `)
}

function shippedHtml(p: OrderEmailPayload) {
  return baseTemplate('¡Tu pedido está en camino! 🚚', `
    <p style="font-size:14px;color:#180A10;margin:0 0 20px">Hola <strong>${p.customerName}</strong>, tu pedido ya fue despachado y está en camino hacia ti.</p>
    <table style="width:100%;border-collapse:collapse">
      ${itemsHtml(p.items)}
    </table>
    ${p.address ? `<p style="margin:20px 0 0;font-size:13px;color:#180A10;opacity:0.6">📍 Dirección de entrega: ${p.address}</p>` : ''}
    <p style="margin:20px 0 0;font-size:13px;color:#180A10;opacity:0.6">Si tienes alguna duda, escríbenos por WhatsApp. ¡Gracias por elegir Anora! 💕</p>
  `)
}

function cancelledHtml(p: OrderEmailPayload) {
  return baseTemplate('Tu pedido fue cancelado', `
    <p style="font-size:14px;color:#180A10;margin:0 0 20px">Hola <strong>${p.customerName}</strong>, lamentamos informarte que tu pedido fue cancelado.</p>
    <table style="width:100%;border-collapse:collapse">
      ${itemsHtml(p.items)}
    </table>
    <p style="margin:20px 0 0;font-size:13px;color:#180A10;opacity:0.6">Si crees que esto es un error o tienes alguna duda, escríbenos por WhatsApp. Estaremos encantadas de ayudarte.</p>
  `)
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as OrderEmailPayload

    if (!payload.to || !payload.type || !payload.customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subjects: Record<EmailType, string> = {
      order_confirmed: '✅ Pedido confirmado — Anora',
      order_shipped:   '🚚 Tu pedido está en camino — Anora',
      order_cancelled: '❌ Pedido cancelado — Anora',
    }

    const htmlFns: Record<EmailType, (p: OrderEmailPayload) => string> = {
      order_confirmed: confirmedHtml,
      order_shipped:   shippedHtml,
      order_cancelled: cancelledHtml,
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[Email] RESEND_API_KEY not set — skipping email')
      return NextResponse.json({ ok: true, skipped: true })
    }

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM,
      to: payload.to,
      subject: subjects[payload.type],
      html: htmlFns[payload.type](payload),
    })

    if (error) {
      console.error('[Email] Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Email] Unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
