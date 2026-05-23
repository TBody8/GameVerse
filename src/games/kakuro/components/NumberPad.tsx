import { Backspace } from '@phosphor-icons/react'
import { playTick } from '@/utils/audio'

interface NumberPadProps {
  onSelect: (num: number | undefined) => void
}

export function NumberPad({ onSelect }: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 'var(--space-2)',
        width: '100%',
        maxWidth: '400px',
        margin: 'var(--space-4) auto 0',
      }}
    >
      {numbers.map(num => (
        <button
          key={num}
          onClick={() => {
            playTick()
            onSelect(num)
          }}
          className="neon-glow-hover font-mono"
          style={{
            height: '48px',
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => {
          playTick()
          onSelect(undefined)
        }}
        className="neon-glow-hover"
        style={{
          height: '48px',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Backspace size={24} />
      </button>
    </div>
  )
}
