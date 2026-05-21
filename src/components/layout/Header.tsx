import LanguageSelector from '@/components/ui/LanguageSelector'
import { playTick } from '@/utils/audio'
import { useLocation } from 'wouter'
import { usePageTransition } from './PageTransitionWrapper'

export default function Header() {
  const [location] = useLocation()
  const { navigateWithTransition } = usePageTransition()

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    playTick()
    
    // Si estamos dentro de un juego, despachamos un evento para que el juego decida si muestra el modal
    if (location.startsWith('/game/')) {
      window.dispatchEvent(new CustomEvent('request-game-exit'))
    } else {
      // Si estamos en la home, no hacemos nada (o navegamos a home que no hará nada)
      navigateWithTransition('/')
    }
  }

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        position: 'relative',
      }}
    >
      <div className="handheld-header-inner">
        <a
          href="/"
          onClick={handleLogoClick}
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
            cursor: 'pointer'
          }}
        >
          <span className="breathing-dot" style={{ color: 'var(--color-accent-hover)', filter: 'drop-shadow(0 0 4px var(--color-accent))' }}>●</span>
          <span className="logo-text">GameVerse</span>
        </a>

        <LanguageSelector />
      </div>
    </header>
  )
}
