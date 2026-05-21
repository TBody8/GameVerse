import { ArrowLeft, ArrowCounterClockwise, MagicWand, DiceFive, Info } from '@phosphor-icons/react'
import { playTick, playHintSound } from '@/utils/audio'
import { formatTime } from '@/utils/storage'

interface GameHeaderProps {
  title: string
  difficulty: string
  time: number
  onReset: () => void
  onNext?: () => void
  onBack: () => void
  onHint?: () => void
  onInfo?: () => void
}

export default function GameHeader({ title, difficulty, time, onReset, onNext, onBack, onHint, onInfo }: GameHeaderProps) {
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
        <button
          onClick={(e) => {
            e.preventDefault()
            playTick()
            onBack()
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
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} weight="bold" />
        </button>

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

        {/* Info (Instrucciones) */}
        {onInfo && (
          <button
            onClick={() => {
              playTick()
              onInfo()
            }}
            aria-label="Información del juego"
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
              cursor: 'pointer'
            }}
          >
            <Info size={20} weight="bold" />
          </button>
        )}

        {/* Varita (Pista) */}
        {onHint && (
          <button
            onClick={() => {
              playHintSound()
              onHint()
            }}
            aria-label="Pista"
            className="neon-glow-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-warning)',
              backgroundColor: 'var(--color-surface-2)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            <MagicWand size={18} weight="bold" />
          </button>
        )}

        {/* Generar Nuevo Tablero */}
        {onNext && (
          <button
            onClick={() => {
              playTick()
              onNext()
            }}
            aria-label="Generar nuevo nivel"
            className="neon-glow-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-accent-text)',
              backgroundColor: 'var(--color-surface-2)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            <DiceFive size={20} weight="bold" />
          </button>
        )}

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
            color: 'var(--color-error)',
            backgroundColor: 'var(--color-surface-2)',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer'
          }}
        >
          <ArrowCounterClockwise size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
