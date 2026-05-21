import GameHeaderWidget from '@/components/game-shared/GameHeader'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'

export default function Slitherlink() {
  const { navigateWithTransition } = usePageTransition()
  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <GameHeaderWidget title="Slitherlink" difficulty="Fácil" time={0} onReset={() => {}} onBack={() => navigateWithTransition('/')} />
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <p>En desarrollo (Fase 3)...</p>
      </div>
    </div>
  )
}