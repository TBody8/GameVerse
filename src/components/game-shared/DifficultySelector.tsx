import { type Difficulty } from '@/types/game'
import { playTick } from '@/utils/audio'

interface DifficultySelectorProps {
  current: Difficulty
  onChange: (difficulty: Difficulty) => void
  labels: Record<Difficulty, string>
}

export default function DifficultySelector({ current, onChange, labels }: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

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
      {difficulties.map((diff) => (
        <button
          key={diff}
          onClick={() => {
            playTick()
            onChange(diff)
          }}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-wide)',
            backgroundColor: current === diff ? 'var(--color-accent)' : 'transparent',
            color: current === diff ? '#060907' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
            textShadow: 'none',
          }}
        >
          {labels[diff]}
        </button>
      ))}
    </div>
  )
}
