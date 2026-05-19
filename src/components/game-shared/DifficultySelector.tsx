import { type Difficulty } from '@/games/train-tracks/logic/types'

interface DifficultySelectorProps {
  current: Difficulty
  onChange: (difficulty: Difficulty) => void
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Medio' },
  { value: 'hard', label: 'Difícil' },
  { value: 'expert', label: 'Experto' },
]

export default function DifficultySelector({ current, onChange }: DifficultySelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        backgroundColor: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-1)',
        alignSelf: 'center',
      }}
    >
      {DIFFICULTIES.map((diff) => (
        <button
          key={diff.value}
          onClick={() => onChange(diff.value)}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            backgroundColor: current === diff.value ? 'var(--color-btn-primary-bg)' : 'transparent',
            color: current === diff.value ? 'var(--color-btn-primary-text)' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          {diff.label}
        </button>
      ))}
    </div>
  )
}
