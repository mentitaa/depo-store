// Server Component — pure CSS animation, no client JS needed

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
    <section className="flex flex-col items-center justify-center px-6 py-20 text-center gap-10">
      {/* Rack SVG + animated garments */}
      <div className="relative w-full max-w-lg">
        {/* Horizontal rod */}
        <div className="relative mx-auto w-[320px]">
          <div className="h-2 w-full rounded-full bg-[#C85880] opacity-80" />

          {/* Hangers + garments */}
          <div className="flex justify-between mt-0 px-2">
            {GARMENTS.map((g, i) => (
              <div key={i} className="garment flex flex-col items-center gap-0.5" style={{ width: 44 }}>
                {/* Hook */}
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-[#C85880]">
                  <path
                    d="M8 0 C8 0 8 4 3 4 C0 4 0 8 3 8"
                    stroke="#C85880"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Hanger body */}
                <svg width="36" height="18" viewBox="0 0 36 18" fill="none">
                  <path
                    d="M18 2 L2 16 L34 16 Z"
                    stroke="#C85880"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill="#F0D4DC"
                  />
                </svg>
                {/* Garment emoji */}
                <span className="text-2xl leading-none mt-0.5" title={g.label}>
                  {g.emoji}
                </span>
              </div>
            ))}
          </div>

          {/* Vertical legs of the rack */}
          <div className="absolute -left-4 top-0 w-1.5 h-24 rounded-full bg-[#C85880] opacity-50" style={{ top: 0 }} />
          <div className="absolute -right-4 top-0 w-1.5 h-24 rounded-full bg-[#C85880] opacity-50" />
          {/* Base */}
          <div className="mx-auto mt-[88px] h-1.5 w-48 rounded-full bg-[#C85880] opacity-40" />
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-4 max-w-sm">
        <h1 className="text-4xl font-bold tracking-tight text-[#180A10] leading-tight">
          Ropa femenina,{' '}
          <span className="text-[#C85880]">disponible ya.</span>
        </h1>
        <p className="text-base text-[#180A10]/60 leading-relaxed">
          Stock real en Trujillo. Sin esperas, sin importaciones. Lo que ves, lo tienes hoy.
        </p>
        <a
          href="#catalogo"
          className="self-center mt-2 px-8 py-3 rounded-full bg-[#C85880] text-white font-semibold text-sm hover:bg-[#a8446a] transition-colors"
        >
          Ver catálogo →
        </a>
      </div>
    </section>
  )
}
