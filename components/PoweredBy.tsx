export default function PoweredBy() {
  return (
    <a
      href="https://www.instagram.com/mentita.studio/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 12px',
        background: '#ffffff',
        border: '1px solid #F0D4DC',
        borderRadius: 8,
        textDecoration: 'none',
        boxShadow: '0 1px 6px rgba(24,10,16,0.06)',
      }}
    >
      <span style={{ fontSize: 10, color: '#180A10', opacity: 0.35, letterSpacing: '0.05em' }}>
        powered by
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/studio-logo.png"
        alt="mentita.studio"
        style={{ height: 20, objectFit: 'contain', display: 'block' }}
      />
    </a>
  )
}
