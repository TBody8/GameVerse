import { useBridges } from './hooks/useBridges'
import Board from './components/Board'
import GameHeaderWidget from '@/components/game-shared/GameHeader'
import DifficultySelector from '@/components/game-shared/DifficultySelector'
import VictoryScreen from '@/components/game-shared/VictoryScreen'
import GameInfoModal from '@/components/game-shared/GameInfoModal'
import { useState, useEffect } from 'react'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Bridges() {
  useLingui() // Suscripción activa al cambio de idioma
  const { state, selectIsland, setDifficulty, nextPuzzle, resetPuzzle, applyHint, saveProgress, clearProgress } = useBridges('easy')
  const [showVictory, setShowVictory] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const { navigateWithTransition } = usePageTransition()

  const BRIDGES_RULES = [
    {
      title: t`Objetivo`,
      content: [t`Conecta todas las islas con puentes para formar una única red continua.`]
    },
    {
      title: t`Restricciones`,
      content: [
        t`El número en la isla indica la cantidad EXACTA de puentes conectados a ella.`,
        t`Los puentes solo pueden ser rectos (horizontales o verticales).`,
        t`Los puentes no pueden cruzarse entre sí ni pasar sobre otra isla.`,
        t`Puedes poner un máximo de 2 puentes entre las mismas dos islas.`,
        t`Todas las islas deben quedar conectadas en un solo grupo.`
      ]
    },
    {
      title: t`Controles`,
      content: [
        t`Toca una isla para seleccionarla (se iluminará el borde).`,
        t`Toca otra isla en línea recta para crear un puente entre ambas.`,
        t`Repite la misma conexión para convertir el puente en DOBLE (rombo central).`,
        t`Una tercera vez borrará los puentes entre esas dos islas.`
      ]
    }
  ]

  // FIX: Eliminar showVictory del array de dependencias para evitar el bucle infinito
  useEffect(() => {
    if (state.isVictory) {
      const t = setTimeout(() => setShowVictory(true), 500)
      return () => clearTimeout(t)
    } else {
      setShowVictory(false)
    }
  }, [state.isVictory])

  const handleBack = () => {
    if (state.moves > 0 && !state.isVictory) {
      saveProgress()
    } else if (state.isVictory || state.moves === 0) {
      clearProgress()
    }
    navigateWithTransition('/')
  }

  useEffect(() => {
    const onGlobalExitRequest = () => {
      handleBack()
    }
    window.addEventListener('request-game-exit', onGlobalExitRequest)
    return () => window.removeEventListener('request-game-exit', onGlobalExitRequest)
  }, [state.isVictory, state.moves, state.difficulty])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 'var(--space-6)', position: 'relative' }}>
      <GameHeaderWidget
        title="Bridges"
        difficulty={
          state.difficulty === 'easy' ? t`Fácil` :
          state.difficulty === 'medium' ? t`Medio` :
          state.difficulty === 'hard' ? t`Difícil` : t`Experto`
        }
        time={state.time}
        onReset={resetPuzzle}
        onNext={nextPuzzle}
        onBack={handleBack}
        onHint={applyHint}
        onInfo={() => setShowInfo(true)}
      />

      <DifficultySelector
        current={state.difficulty}
        onChange={(diff) => {
          if (state.moves > 0 && !state.isVictory) {
            saveProgress()
          } else if (state.isVictory || state.moves === 0) {
            clearProgress()
          }
          setShowVictory(false)
          setDifficulty(diff)
        }}
        labels={{ easy: '5x5', medium: '7x7', hard: '10x10', expert: '13x13' }}
      />

      <Board 
        puzzle={state.puzzle} 
        bridges={state.bridges} 
        validation={state.validation} 
        hintedIslandId={state.hintedIslandId}
        selectedIslandId={state.selectedIslandId}
        onSelectIsland={selectIsland}
      />

      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: '48ch', lineHeight: 1.5 }}>
        {t`Selecciona una isla y luego otra en línea recta para crear un puente.`} <strong style={{ color: '#D4A843' }}>{t`Repite la misma conexión para puente doble.`}</strong>
      </p>

      {showInfo && (
        <GameInfoModal
          gameName="Bridges"
          sections={BRIDGES_RULES}
          onClose={() => setShowInfo(false)}
        />
      )}

      {showVictory && (
        <VictoryScreen 
          time={state.time} 
          onNext={nextPuzzle} 
          onReset={resetPuzzle} 
          gameId="bridges" 
          difficulty={state.difficulty} 
        />
      )}
    </div>
  )
}
