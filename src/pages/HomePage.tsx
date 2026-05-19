import PageLayout from '@/components/layout/PageLayout'
import { gameRegistry } from '@/games/registry'
import { Link } from 'wouter'
import { Train, Globe } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HomePage() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.children
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        }
      )
    }
  }, [])

  return (
    <PageLayout>
      <div style={{ marginBottom: 'var(--space-12)' }}>
        <h1
          style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tighter)',
            marginBottom: 'var(--space-2)',
          }}
        >
          GameVerse
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: '54ch',
          }}
        >
          Una colección minimalista de pasatiempos y juegos de lógica diseñados para jugar en cualquier lugar, incluso sin conexión.
        </p>
      </div>

      <div
        ref={cardsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {Object.values(gameRegistry).map((game) => {
          const Icon = game.iconName === 'Train' ? Train : Globe

          return (
            <Link key={game.id} href={game.available ? `/game/${game.id}` : '#'}>
              <a
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'var(--space-8)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all var(--transition-base)',
                  cursor: game.available ? 'pointer' : 'default',
                  opacity: game.available ? 1 : 0.6,
                }}
                className="game-card"
                onMouseEnter={(e) => {
                  if (game.available) {
                    gsap.to(e.currentTarget, {
                      y: -4,
                      boxShadow: 'var(--shadow-md)',
                      borderColor: 'var(--color-accent)',
                      duration: 0.2,
                    })
                  }
                }}
                onMouseLeave={(e) => {
                  if (game.available) {
                    gsap.to(e.currentTarget, {
                      y: 0,
                      boxShadow: 'none',
                      borderColor: 'var(--color-border)',
                      duration: 0.2,
                    })
                  }
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-accent-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <Icon size={24} weight="bold" />
                </div>

                <h2
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  {game.nameKey}
                </h2>

                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: 'var(--space-6)',
                    flex: 1,
                  }}
                >
                  {game.descriptionKey}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-wide)',
                    }}
                  >
                    {game.available ? 'Jugar' : 'Próximamente'}
                  </span>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </PageLayout>
  )
}
