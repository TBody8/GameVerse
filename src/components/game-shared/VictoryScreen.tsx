import { playVictorySound, playTick } from '@/utils/audio'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useStats } from '@/hooks/useStats'
import { formatTime } from '@/utils/storage'
import { useLocation } from 'wouter'

interface VictoryScreenProps {
  time: number
  onNext: () => void
  onReset: () => void
  gameId?: string
  difficulty?: string
  message?: string
}

export default function VictoryScreen({ time, onNext, onReset, gameId, difficulty, message }: VictoryScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { recordWin } = useStats()
  const [, navigate] = useLocation()

  useEffect(() => {
    // Solo guardar victoria una vez cuando se muestra la pantalla
    if (gameId && difficulty) {
      recordWin(gameId, difficulty, time)
    }

    // Reproducir melodía triunfal de la consola
    playVictorySound()

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, scale: 0.9, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' }
      )
    }
  }, [gameId, difficulty, time, recordWin])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 9, 7, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-6)',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'var(--color-surface)',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-10)',
          boxShadow: 'var(--shadow-neon-glow-hover)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-accent-text)',
            marginBottom: 'var(--space-6)',
            border: '2px solid var(--color-border)',
            boxShadow: 'var(--shadow-neon-glow)',
          }}
        >
          <span style={{ fontSize: '32px', filter: 'drop-shadow(0 0 6px var(--color-accent))' }}>★</span>
        </div>

        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: 'var(--space-2)',
            textShadow: 'var(--shadow-neon-text)',
          }}
        >
          [ PUZZLE COMPLETADO ]
        </h2>

        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {message || '¡Has completado el puzzle con éxito!'}
        </p>

        {/* Cronómetro Nixie final */}
        <div
          style={{
            backgroundColor: '#0A0D0B',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4) var(--space-8)',
            marginBottom: 'var(--space-8)',
            width: '100%',
            boxShadow: 'var(--shadow-neon-glow)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              fontWeight: 700,
              display: 'block',
              marginBottom: 'var(--space-1)',
            }}
          >
            TIEMPO REGISTRADO
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-accent-text)',
              textShadow: 'var(--shadow-neon-text)',
            }}
          >
            {formatTime(time)}
          </span>
        </div>

        {/* Acciones */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            width: '100%',
          }}
        >
          <button
            onClick={() => {
              playTick()
              onNext()
            }}
            className="neon-glow"
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-accent)',
              color: '#060907',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-wide)',
              transition: 'background-color var(--transition-fast)',
              boxShadow: 'var(--shadow-neon-glow)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
          >
            SIGUIENTE PUZZLE
          </button>

          <button
            onClick={() => {
              playTick()
              onReset()
            }}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            REINICIAR
          </button>

          <button
            onClick={() => {
              playTick()
              navigate('/')
            }}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    </div>
  )
}
