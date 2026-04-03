// Server Component — pure CSS animation, no client JS needed

const MONO = 'ui-monospace, "Cascadia Code", "Fira Code", monospace'

const GARMENTS = [
  { emoji: '👗', label: 'Vestido floral' },
  { emoji: '🧥', label: 'Chaqueta' },
  { emoji: '👚', label: 'Top' },
  { emoji: '🩱', label: 'Enterizo' },
  { emoji: '👘', label: 'Kimono' },
  { emoji: '🥻', label: 'Falda' },
]

export default function Hero() {
  return (
    <div style={{ margin: '20px 24px 0' }}>
      <section
        style={{
          background: '#180A10',
          borderRadius: 16,
          padding: '28px 24px 26px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20,
        }}
      >
        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Badge 1 — location */}
          <span
            style={{
              background: '#1E1016',
              border: '1px solid #3A1A24',
              borderRadius: 20,
              padding: '6px 14px',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 12,
              color: '#C85880',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🇵🇪 Trujillo, Perú
          </span>

          {/* Badge 2 — shipping */}
          <span
            style={{
              background: '#1E1016',
              border: '1px solid #3A1A24',
              borderRadius: 20,
              padding: '6px 14px',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 12,
              color: '#C85880',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#C85880',
                flexShrink: 0,
                animation: 'blink 1.2s step-start infinite',
                display: 'inline-block',
              }}
            />
            Envíos inmediatos
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            color: '#ffffff',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Mi DEPO 📦
        </h1>

        {/* Rack animation */}
        <div className="relative w-full max-w-xs">
          <div className="relative mx-auto w-[300px]">
            {/* Rod */}
            <div className="h-1.5 w-full rounded-full" style={{ background: '#C85880', opacity: 0.9 }} />

            {/* Hangers + garments */}
            <div className="flex justify-between mt-0 px-2">
              {GARMENTS.map((g, i) => (
                <div key={i} className="garment flex flex-col items-center gap-0.5" style={{ width: 40 }}>
                  {/* Hook */}
                  <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
                    <path
                      d="M8 0 C8 0 8 4 3 4 C0 4 0 8 3 8"
                      stroke="#C85880"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  {/* Hanger body */}
                  <svg width="32" height="16" viewBox="0 0 36 18" fill="none">
                    <path
                      d="M18 2 L2 16 L34 16 Z"
                      stroke="#C85880"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      fill="#3A1A24"
                    />
                  </svg>
                  {/* Garment */}
                  <span className="text-xl leading-none mt-0.5" title={g.label}>{g.emoji}</span>
                </div>
              ))}
            </div>

            {/* Rack legs */}
            <div
              className="absolute w-1 rounded-full"
              style={{ left: -12, top: 0, height: 88, background: '#C85880', opacity: 0.5 }}
            />
            <div
              className="absolute w-1 rounded-full"
              style={{ right: -12, top: 0, height: 88, background: '#C85880', opacity: 0.5 }}
            />
            {/* Base */}
            <div
              className="mx-auto rounded-full"
              style={{ marginTop: 84, height: 5, width: 160, background: '#C85880', opacity: 0.35 }}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: '#C85880',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          // Sin esperas, lo que ves, lo tienes hoy.
        </p>

        {/* CTA */}
        <a
          href="#catalogo"
          className="hero-cta"
          style={{
            padding: '10px 24px',
            background: '#C85880',
            color: '#ffffff',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 13,
            borderRadius: 8,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background 0.2s',
          }}
        >
          ver_coleccion →
        </a>
      </section>
    </div>
  )
}
