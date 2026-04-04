import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export type EmailType = 'order_confirmed' | 'order_shipped' | 'order_cancelled'

interface OrderEmailPayload {
  type: EmailType
  to: string
  customerName: string
  items: { name: string; size: string; color: string; quantity: number; price: number }[]
  total: number
  address?: string
}

function itemsTable(items: OrderEmailPayload['items'], total: number) {
  const rows = items.map(i =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #F0D4DC;font-size:14px;color:#180A10;font-family:Georgia,serif">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #F0D4DC;font-size:13px;color:#180A10;text-align:center;font-family:Georgia,serif">Talla ${i.size}${i.quantity > 1 ? ` ×${i.quantity}` : ''}</td>
      <td style="padding:10px 0;border-bottom:1px solid #F0D4DC;font-size:14px;color:#C85880;font-weight:700;text-align:right;font-family:Georgia,serif">S/ ${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('')
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;color:#180A10;opacity:0.4;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:2px solid #F0D4DC;font-family:Georgia,serif">Producto</th>
          <th style="text-align:center;font-size:11px;color:#180A10;opacity:0.4;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:2px solid #F0D4DC;font-family:Georgia,serif">Talla</th>
          <th style="text-align:right;font-size:11px;color:#180A10;opacity:0.4;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;border-bottom:2px solid #F0D4DC;font-family:Georgia,serif">Precio</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top:10px;font-size:13px;color:#180A10;opacity:0.5;font-family:Georgia,serif">Total</td>
          <td style="padding-top:10px;font-size:18px;font-weight:700;color:#C85880;text-align:right;font-family:Georgia,serif">S/ ${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>`
}

function baseTemplate(body: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF8FA;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:520px;margin:32px auto;padding:0 16px">
    <div style="text-align:center;padding:24px 0 20px">
      <span style="font-family:Georgia,serif;font-weight:700;font-size:26px;color:#180A10;letter-spacing:0.05em">Anora✨</span>
    </div>
    <div style="background:#ffffff;border:1px solid #F0D4DC;border-radius:16px;overflow:hidden">
      ${body}
    </div>
    <div style="text-align:center;padding:20px 0 32px">
      <span style="font-size:12px;color:#180A10;opacity:0.35;font-family:Georgia,serif">Anora — Ropa femenina en Trujillo, Perú</span>
    </div>
  </div>
</body>
</html>`
}

function confirmedHtml(p: OrderEmailPayload) {
  return baseTemplate(`
    <div style="background:#C85880;padding:20px 28px">
      <p style="margin:0;font-size:20px;color:#ffffff;font-weight:700;font-family:Georgia,serif">¡Pedido recibido! 🎉</p>
    </div>
    <div style="padding:28px">
      <p style="margin:0 0 8px;font-size:15px;color:#180A10;font-family:Georgia,serif">Hola <strong>${p.customerName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#180A10;line-height:1.6;font-family:Georgia,serif">Recibimos tu pedido correctamente. Te contactaremos pronto por WhatsApp para coordinar la entrega.</p>
      ${itemsTable(p.items, p.total)}
      ${p.address ? `<p style="margin:16px 0 0;font-size:13px;color:#180A10;font-family:Georgia,serif"><strong>📍 Dirección:</strong> ${p.address}</p>` : ''}
      <div style="margin-top:24px;padding:14px 16px;background:#FFF8FA;border-radius:10px;border:1px solid #F0D4DC">
        <p style="margin:0;font-size:13px;color:#C85880;font-weight:700;font-family:Georgia,serif">¿Tienes dudas?</p>
        <p style="margin:4px 0 0;font-size:13px;color:#180A10;opacity:0.6;font-family:Georgia,serif">Escríbenos por WhatsApp y te respondemos al instante.</p>
      </div>
    </div>`)
}

function shippedHtml(p: OrderEmailPayload) {
  return baseTemplate(`
    <div style="background:#16a34a;padding:20px 28px">
      <p style="margin:0;font-size:20px;color:#ffffff;font-weight:700;font-family:Georgia,serif">Tu pedido está en camino 🚚</p>
    </div>
    <div style="padding:28px">
      <p style="margin:0 0 8px;font-size:15px;color:#180A10;font-family:Georgia,serif">Hola <strong>${p.customerName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#180A10;line-height:1.6;font-family:Georgia,serif">¡Buenas noticias! Tu motorizado ya está en camino con tu pedido.</p>
      ${itemsTable(p.items, p.total)}
      ${p.address ? `<p style="margin:16px 0 0;font-size:13px;color:#180A10;font-family:Georgia,serif"><strong>📍 Dirección de entrega:</strong> ${p.address}</p>` : ''}
      <div style="margin-top:24px;padding:14px 16px;background:#FFF8FA;border-radius:10px;border:1px solid #F0D4DC">
        <p style="margin:0;font-size:13px;color:#C85880;font-weight:700;font-family:Georgia,serif">¿Alguna duda sobre tu entrega?</p>
        <p style="margin:4px 0 0;font-size:13px;color:#180A10;opacity:0.6;font-family:Georgia,serif">Escríbenos por WhatsApp y coordinamos al instante.</p>
      </div>
    </div>`)
}

function cancelledHtml(p: OrderEmailPayload) {
  return baseTemplate(`
    <div style="background:#dc2626;padding:20px 28px">
      <p style="margin:0;font-size:20px;color:#ffffff;font-weight:700;font-family:Georgia,serif">Actualización sobre tu pedido</p>
    </div>
    <div style="padding:28px">
      <p style="margin:0 0 8px;font-size:15px;color:#180A10;font-family:Georgia,serif">Hola <strong>${p.customerName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#180A10;line-height:1.6;font-family:Georgia,serif">Lamentamos informarte que tu pedido no pudo procesarse y fue cancelado. Esto puede deberse a un problema de stock o de logística.</p>
      ${itemsTable(p.items, p.total)}
      <div style="margin-top:24px;padding:14px 16px;background:#FFF8FA;border-radius:10px;border:1px solid #F0D4DC">
        <p style="margin:0;font-size:13px;color:#C85880;font-weight:700;font-family:Georgia,serif">¿Tienes dudas o crees que es un error?</p>
        <p style="margin:4px 0 0;font-size:13px;color:#180A10;opacity:0.6;font-family:Georgia,serif">Escríbenos por WhatsApp y lo resolvemos juntas.</p>
      </div>
    </div>`)
}

export async function POST(req: NextRequest) {
  console.log('[send-email] Petición recibida')
  console.log('[send-email] API Key existe:', !!process.env.RESEND_API_KEY)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[send-email] RESEND_API_KEY no configurada')
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  try {
    const payload = (await req.json()) as OrderEmailPayload
    console.log('[send-email] Tipo:', payload.type, '| Enviando email a:', payload.to)

    if (!payload.to || !payload.type || !payload.customerName) {
      return NextResponse.json({ error: 'Missing required fields: to, type, customerName' }, { status: 400 })
    }

    const subjects: Record<EmailType, string> = {
      order_confirmed: 'Tu pedido en Anora✨ fue recibido 🎉',
      order_shipped:   'Tu pedido está en camino 🚚',
      order_cancelled: 'Actualización sobre tu pedido en Anora✨',
    }

    const htmlFns: Record<EmailType, (p: OrderEmailPayload) => string> = {
      order_confirmed: confirmedHtml,
      order_shipped:   shippedHtml,
      order_cancelled: cancelledHtml,
    }

    const resend = new Resend(apiKey)

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: payload.to,
      subject: subjects[payload.type],
      html: htmlFns[payload.type](payload),
    })

    console.log('[send-email] Respuesta Resend:', JSON.stringify(response))

    if (response.error) {
      console.error('[send-email] Error Resend:', response.error)
      return NextResponse.json({ error: response.error }, { status: 500 })
    }

    console.log('[send-email] Email enviado exitosamente. ID:', response.data?.id)
    return NextResponse.json({ ok: true, id: response.data?.id })
  } catch (err) {
    console.error('[send-email] Error inesperado:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
