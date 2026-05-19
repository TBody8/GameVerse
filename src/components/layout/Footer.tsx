export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        marginTop: 'auto',
      }}
    >
      <div className="handheld-footer-inner">
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
