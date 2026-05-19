import { Suspense } from 'react'
import { useRoute } from 'wouter'
import PageLayout from '@/components/layout/PageLayout'
import { gameRegistry } from '@/games/registry'
import NotFoundPage from './NotFoundPage'

export default function GamePage() {
  const [, params] = useRoute('/game/:gameId')
  const gameId = params?.gameId

  const game = gameId ? gameRegistry[gameId] : null

  if (!game || !game.available) {
    return <NotFoundPage />
  }

  const GameComponent = game.component

  return (
    <PageLayout>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              gap: 'var(--space-4)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--color-border)',
                borderTopColor: 'var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }
      >
        <GameComponent />
      </Suspense>
    </PageLayout>
  )
}
