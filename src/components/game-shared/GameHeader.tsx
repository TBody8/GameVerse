import { Link } from 'wouter'
import { ArrowLeft, ArrowCounterClockwise } from '@phosphor-icons/react'
import { playTick } from '@/utils/audio'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'

interface GameHeaderProps {
  title: string
  difficulty: string
  time: number
  onReset: () => void
}

export default function GameHeader({ title, difficulty, time, onReset }: GameHeaderProps) {
  const { navigateWithTransition } = usePageTransition()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        width: '100%',
        marginBottom: 'var(--space-6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault()
            playTick()
            navigateWithTransition('/')
          }}
          className="icon-arrow-left neon-glow-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-surface-2)',
            transition: 'all var(--transition-fast)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={18} weight="bold" />
        </Link>

        <div>
          <h1
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tight)',
              textShadow: 'var(--shadow-neon-text)',
            }}
          >
            {title.toUpperCase()}
          </h1>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--color-accent-text)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              fontWeight: 700,
            }}
          >
            [ DIFICULTAD: {difficulty.toUpperCase()} ]
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* HUD Cronómetro Nixie Neón */}
        <div
          className="font-mono"
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-accent-text)',
            backgroundColor: '#0A0D0B',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-4)',
            minWidth: '86px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-neon-glow)',
            textShadow: 'var(--shadow-neon-text)',
          }}
        >
          {formatTime(time)}
        </div>

        {/* Reiniciar Táctil */}
        <button
          onClick={() => {
            playTick()
            onReset()
          }}
          aria-label="Reiniciar tablero"
          className="neon-glow-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-surface-2)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <ArrowCounterClockwise size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
