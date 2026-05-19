import { type Difficulty } from '@/games/train-tracks/logic/types'
import { playTick } from '@/utils/audio'

interface DifficultySelectorProps {
  current: Difficulty
  onChange: (difficulty: Difficulty) => void
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '4x4' },
  { value: 'medium', label: '6x6' },
  { value: 'hard', label: '8x8' },
  { value: 'expert', label: '10x10' },
]

export default function DifficultySelector({ current, onChange }: DifficultySelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        backgroundColor: '#090E0C',
        border: '2px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-1)',
        alignSelf: 'center',
        marginBottom: 'var(--space-4)',
        boxShadow: 'var(--shadow-neon-glow)',
      }}
    >
      {DIFFICULTIES.map((diff) => (
        <button
          key={diff.value}
          onClick={() => {
            playTick()
            onChange(diff.value)
          }}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-wide)',
            backgroundColor: current === diff.value ? 'var(--color-accent)' : 'transparent',
            color: current === diff.value ? '#060907' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
            textShadow: current === diff.value ? 'none' : 'none',
          }}
        >
          {diff.label}
        </button>
      ))}
    </div>
  )
}
