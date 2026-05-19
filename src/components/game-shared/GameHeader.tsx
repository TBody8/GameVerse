import { Link } from 'wouter'
import { ArrowLeft, ArrowCounterClockwise } from '@phosphor-icons/react'

interface GameHeaderProps {
  title: string
  difficulty: string
  time: number
  onReset: () => void
}

export default function GameHeader({ title, difficulty, time, onReset }: GameHeaderProps) {
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
        marginBottom: 'var(--space-8)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Link href="/">
          <a
            className="icon-arrow-left"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <ArrowLeft size={18} weight="bold" />
          </a>
        </Link>

        <div>
          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {title}
          </h1>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
              fontWeight: 600,
            }}
          >
            {difficulty}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* Temporizador */}
        <div
          className="font-mono"
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-4)',
            minWidth: '76px',
            textAlign: 'center',
          }}
        >
          {formatTime(time)}
        </div>

        {/* Reiniciar */}
        <button
          onClick={onReset}
          aria-label="Reiniciar tablero"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-surface)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <ArrowCounterClockwise size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
