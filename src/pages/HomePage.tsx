import PageLayout from '@/components/layout/PageLayout'
import { gameRegistry } from '@/games/registry'
import { Link } from 'wouter'
import { Train, Globe } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { playTick } from '@/utils/audio'

export default function HomePage() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.children
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.95,
          y: 16,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.4)',
        }
      )
    }
  }, [])

  return (
    <PageLayout>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tighter)',
            marginBottom: 'var(--space-2)',
            textShadow: 'var(--shadow-neon-text)',
          }}
        >
          [ SELECCIONAR CARTUCHO ]
        </h1>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '54ch',
          }}
        >
          Introduce un cartucho digital para cargar el puzzle. Todo el progreso se autoguarda en el chasis de la consola.
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
            <Link
              key={game.id}
              href={game.available ? `/game/${game.id}` : '#'}
              onClick={() => playTick()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--space-8)',
                backgroundColor: 'var(--color-surface-2)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all var(--transition-base)',
                cursor: game.available ? 'pointer' : 'default',
                opacity: game.available ? 1 : 0.4,
                position: 'relative',
                overflow: 'hidden',
              }}
              className="game-card neon-glow-hover"
              onMouseEnter={(e) => {
                if (game.available) {
                  gsap.to(e.currentTarget, {
                    y: -6,
                    borderColor: 'var(--color-accent-hover)',
                    duration: 0.25,
                    ease: 'power2.out',
                  })
                }
              }}
              onMouseLeave={(e) => {
                if (game.available) {
                  gsap.to(e.currentTarget, {
                    y: 0,
                    borderColor: 'var(--color-border)',
                    duration: 0.25,
                    ease: 'power2.out',
                  })
                }
              }}
            >
              {/* Ranura del cartucho estética */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '4px',
                  backgroundColor: 'var(--color-accent)',
                  borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                  boxShadow: 'var(--shadow-neon-glow)',
                }}
              />

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-accent-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-text)',
                  marginBottom: 'var(--space-4)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-neon-glow)',
                }}
              >
                <Icon size={24} weight="bold" />
              </div>

              <h2
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-2)',
                  textShadow: 'var(--shadow-neon-text)',
                }}
              >
                {game.nameKey.toUpperCase()}
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
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: game.available ? 'var(--color-accent-text)' : 'var(--color-text-disabled)',
                  textShadow: game.available ? 'var(--shadow-neon-text)' : 'none',
                  fontWeight: 700,
                }}
              >
                <span>{game.available ? '● CARGAR JUEGO' : '○ BLOQUEADO'}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </PageLayout>
  )
}
