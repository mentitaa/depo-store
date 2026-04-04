export default function PoweredBy() {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '0.5px solid #F0D4DC',
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 11, color: '#BBB', letterSpacing: '0.05em' }}>
        powered by
      </span>
      <a
        href="https://www.instagram.com/mentita.studio/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', lineHeight: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/studio-logo.png"
          alt="mentita.studio"
          style={{ height: 20, objectFit: 'contain', display: 'block' }}
        />
      </a>
    </footer>
  )
}
