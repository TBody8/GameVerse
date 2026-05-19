export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--space-6) var(--space-6)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
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
          [ DEVICE STATUS: 100% OFFLINE ]
        </span>

        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-accent-text)',
            fontFamily: 'var(--font-mono)',
            textShadow: 'var(--shadow-neon-text)',
            fontWeight: 600,
          }}
        >
          NEON POWERED
        </span>
      </div>
    </footer>
  )
}
