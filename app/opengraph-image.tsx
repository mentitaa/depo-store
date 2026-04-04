import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Anora - Ropa femenina en Trujillo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#180A10',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '0 80px',
        }}
      >
        {/* Brand name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          Anora✨
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: '#C85880',
            letterSpacing: '0.05em',
          }}
        >
          Ropa femenina en Trujillo
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 8,
          }}
        >
          Sin esperas — lo que ves, lo tienes hoy.
        </div>
      </div>
    ),
    { ...size }
  )
}
