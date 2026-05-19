import LanguageSelector from '@/components/ui/LanguageSelector'
import { Link } from 'wouter'

export default function Header() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="header-inner"
        style={{
          maxWidth: 'var(--max-w-content)',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/">
          <a
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tighter)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span style={{ color: 'var(--color-accent)' }}>●</span>
            <span>GameVerse</span>
          </a>
        </Link>

        <LanguageSelector />
      </div>
    </header>
  )
}
