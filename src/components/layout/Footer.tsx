export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--space-8) var(--space-6)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-w-content)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          © 2026 GameVerse. 100% Offline.
        </span>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-6)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Zero-Backend
          </span>
        </div>
      </div>
    </footer>
  )
}
