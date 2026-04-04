// Server Component — pure CSS animation, no client JS needed

const MONO = 'ui-monospace, "Cascadia Code", "Fira Code", monospace'


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
          Anora✨
        </h1>

        {/* Rack animation */}
        <svg viewBox="0 0 600 185" style={{ width: '100%', maxWidth: 580, overflow: 'visible' }}>
          <rect x="16" y="34" width="568" height="5" fill="#3A1A24" rx="2.5"/>
          <rect x="296" y="2" width="5" height="34" fill="#3A1A24"/>
          <g className="hg h1">
            <circle cx="82" cy="32" r="4.5" fill="none" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="82" y1="36" x2="55" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="82" y1="36" x2="109" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="55" y1="66" x2="109" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <path d="M58,66 L44,152 L120,152 L106,66 Z" fill="#F4AABF"/>
            <path d="M63,66 L58,90 L106,90 L101,66 Z" fill="#E890AC"/>
          </g>
          <g className="hg h2">
            <circle cx="162" cy="32" r="4.5" fill="none" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="162" y1="36" x2="135" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="162" y1="36" x2="189" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="135" y1="66" x2="189" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <rect x="137" y="66" width="50" height="46" fill="#98D0AA" rx="2"/>
            <rect x="144" y="112" width="16" height="48" fill="#98D0AA"/>
            <rect x="164" y="112" width="16" height="48" fill="#84BEAA"/>
          </g>
          <g className="hg h3">
            <circle cx="242" cy="32" r="4.5" fill="none" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="242" y1="36" x2="215" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="242" y1="36" x2="269" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="215" y1="66" x2="269" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <path d="M217,66 L212,114 L272,114 L267,66 Z" fill="#E8D0B4"/>
            <path d="M222,66 L217,88 L267,88 L262,66 Z" fill="#D8BC9C"/>
          </g>
          <g className="hg h4">
            <circle cx="358" cy="32" r="4.5" fill="none" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="358" y1="36" x2="331" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="358" y1="36" x2="385" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="331" y1="66" x2="385" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <path d="M334,66 L318,155 L398,155 L382,66 Z" fill="#C8B4EC"/>
            <path d="M340,66 L334,92 L382,92 L376,66 Z" fill="#B4A0DC"/>
          </g>
          <g className="hg h5">
            <circle cx="438" cy="32" r="4.5" fill="none" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="438" y1="36" x2="411" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="438" y1="36" x2="465" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="411" y1="66" x2="465" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <rect x="413" y="66" width="50" height="44" fill="#F4A890" rx="2"/>
            <rect x="418" y="110" width="17" height="52" fill="#F4A890"/>
            <rect x="439" y="110" width="17" height="52" fill="#E49480"/>
          </g>
          <g className="hg h6">
            <circle cx="518" cy="32" r="4.5" fill="none" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="518" y1="36" x2="491" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="518" y1="36" x2="545" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <line x1="491" y1="66" x2="545" y2="66" stroke="#C85880" strokeWidth="1.5"/>
            <path d="M493,66 L487,118 L549,118 L543,66 Z" fill="#A8C8EC"/>
            <path d="M498,66 L493,90 L543,90 L538,66 Z" fill="#94B4DC"/>
          </g>
        </svg>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: MONO,
            fontSize: 15,
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
