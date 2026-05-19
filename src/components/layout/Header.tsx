import LanguageSelector from '@/components/ui/LanguageSelector'
import { Link } from 'wouter'
import { playTick } from '@/utils/audio'

export default function Header() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        position: 'relative',
      }}
    >
      <div
        className="header-inner"
        style={{
          padding: 'var(--space-4) var(--space-8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          onClick={() => playTick()}
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tighter)',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            textShadow: 'var(--shadow-neon-text)',
            textDecoration: 'none',
          }}
        >
          <span style={{ color: 'var(--color-accent-hover)', filter: 'drop-shadow(0 0 4px var(--color-accent))' }}>●</span>
          <span>GameVerse</span>
        </Link>

        <LanguageSelector />
      </div>
    </header>
  )
}
