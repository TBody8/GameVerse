import PageLayout from '@/components/layout/PageLayout'
import { gameRegistry } from '@/games/registry'
import { Link } from 'wouter'
import { Train, Globe, Anchor, GridNine, BoundingBox, GridFour, Bomb, ImageSquare, LockKey } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { playTick, playBootSound, playBlock } from '@/utils/audio'
import ConsoleHeader from '@/components/ui/ConsoleHeader'
import ScrambleText from '@/components/ui/ScrambleText'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'
import { useStats } from '@/hooks/useStats'

import { t } from '@lingui/macro'

import { useLingui } from '@lingui/react'

export default function HomePage() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const { navigateWithTransition } = usePageTransition()
  const { i18n } = useLingui()
  const { stats } = useStats()

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    // Intentar reproducir sonido de inicialización al cargar
    playBootSound()
    
    // Y registrar un listener de un solo uso para reproducirlo al primer click si el navegador lo bloqueó
    const playBootOnFirstClick = () => {
      playBootSound()
      document.removeEventListener('click', playBootOnFirstClick)
    }
    document.addEventListener('click', playBootOnFirstClick)

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
        <ConsoleHeader />
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '54ch',
          }}
        >
          {t`Introduce un cartucho digital para cargar el puzzle. Todo el progreso se autoguarda en el chasis de la consola.`}
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
          // Icon Mapper (podemos mover esto al registro en el futuro)
          const IconMap: Record<string, any> = {
            'Train': Train,
            'Globe': Globe,
            'ShareNetwork': Globe, // Fallback si no hay icon específico importado o usar uno general
            'Anchor': Anchor,
            'GridNine': GridNine,
            'BoundingBox': BoundingBox,
            'GridFour': GridFour,
            'Bomb': Bomb,
            'ImageSquare': ImageSquare
          }
          const RegularIcon = IconMap[game.iconName] || Globe
          const Icon = game.available ? RegularIcon : LockKey

          const gameStats = stats.games[game.id]
          let bestTimeStr = ''
          if (gameStats?.bestTime && Object.keys(gameStats.bestTime).length > 0) {
            const minTime = Math.min(...Object.values(gameStats.bestTime) as number[])
            bestTimeStr = formatTime(minTime)
          }

          return (
            <Link
              key={game.id}
              href={game.available ? `/game/${game.id}` : '#'}
              onClick={(e) => {
                e.preventDefault()
                const target = e.currentTarget // Guardamos referencia segura para GSAP

                if (game.available) {
                  playTick()
                  
                  // Efecto de rebote del cartucho antes del warp
                  gsap.to(target, {
                    scale: 1.05,
                    y: -12,
                    boxShadow: 'var(--shadow-neon-glow-hover)',
                    borderColor: 'var(--color-accent-hover)',
                    duration: 0.2,
                    ease: 'back.out(2)',
                    onComplete: () => {
                      navigateWithTransition(`/game/${game.id}`)
                    }
                  })
                } else {
                  // Efecto de Archivo Clasificado denegado
                  playBlock()
                  gsap.fromTo(target, 
                    { x: -4 },
                    { x: 4, duration: 0.05, yoyo: true, repeat: 5, ease: 'power2.inOut', onComplete: () => gsap.set(target, { x: 0 }) }
                  )
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--space-8)',
                backgroundColor: 'var(--color-surface-2)',
                border: `2px solid ${game.available ? 'var(--color-border)' : 'rgba(239, 68, 68, 0.15)'}`,
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all var(--transition-base)',
                cursor: game.available ? 'pointer' : 'not-allowed',
                opacity: game.available ? 1 : 0.6,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: game.available ? 'none' : 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}
              className={game.available ? "game-card neon-glow-hover holographic-shimmer" : "game-card"}
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
                  backgroundColor: game.available ? 'var(--color-accent)' : 'var(--color-error)',
                  borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                  boxShadow: game.available ? 'var(--shadow-neon-glow)' : '0 0 8px rgba(239, 68, 68, 0.5)',
                  opacity: game.available ? 1 : 0.5
                }}
              />

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: game.available ? 'var(--color-accent-subtle)' : 'rgba(239, 68, 68, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: game.available ? 'var(--color-accent-text)' : 'var(--color-error)',
                  marginBottom: 'var(--space-4)',
                  border: `1px solid ${game.available ? 'var(--color-border)' : 'rgba(239, 68, 68, 0.2)'}`,
                  boxShadow: game.available ? 'var(--shadow-neon-glow)' : '0 0 10px rgba(239, 68, 68, 0.1)',
                }}
              >
                <Icon size={24} weight={game.available ? "bold" : "duotone"} />
              </div>

              <h2
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-2)',
                  textShadow: game.available ? 'var(--shadow-neon-text)' : '0 0 4px rgba(239, 68, 68, 0.4)',
                  color: game.available ? 'inherit' : 'var(--color-error)'
                }}
              >
                {game.available ? (
                  i18n._(game.nameKey).toUpperCase()
                ) : (
                  <ScrambleText text={i18n._(game.nameKey).toUpperCase()} duration={3} />
                )}
              </h2>

              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: game.available ? 'var(--color-text-secondary)' : 'var(--color-text-disabled)',
                  lineHeight: 1.5,
                  marginBottom: 'var(--space-6)',
                  flex: 1,
                  fontFamily: game.available ? 'inherit' : 'var(--font-mono)',
                  letterSpacing: game.available ? 'normal' : '0.05em'
                }}
              >
                {game.available ? (
                  i18n._(game.descriptionKey)
                ) : (
                  <ScrambleText text={t`[DATOS ENCRIPTADOS] CONTENIDO DEL CARTUCHO RESTRINGIDO. SE REQUIERE AUTORIZACIÓN DE NIVEL 4.`} duration={4} />
                )}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: game.available ? 'var(--color-accent-text)' : 'var(--color-error)',
                  textShadow: game.available ? 'var(--shadow-neon-text)' : '0 0 4px rgba(239, 68, 68, 0.4)',
                  fontWeight: 700,
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: game.available ? 'transparent' : 'rgba(239, 68, 68, 0.05)',
                  border: game.available ? 'none' : '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <span>{game.available ? `● ${t({ id: 'CARGAR JUEGO', message: 'CARGAR JUEGO' })}` : `! ${t({ id: 'ESTADO: EN DESARROLLO', message: 'ESTADO: EN DESARROLLO' })}`}</span>
                {game.available && gameStats?.wins > 0 && (
                  <span style={{ color: 'var(--color-text-secondary)', textShadow: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{t({ id: 'WINS', message: 'WINS' })}: {gameStats.wins}</span>
                    {bestTimeStr && (
                      <>
                        <span style={{ opacity: 0.5 }}>|</span>
                        <span>{t({ id: 'BEST', message: 'BEST' })}: {bestTimeStr}</span>
                      </>
                    )}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </PageLayout>
  )
}
