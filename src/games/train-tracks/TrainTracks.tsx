import { useTrainTracks } from './hooks/useTrainTracks'
import { useTrainAnimation } from './hooks/useTrainAnimation'
import Board from './components/Board'
import GameHeaderWidget from '@/components/game-shared/GameHeader'
import DifficultySelector from '@/components/game-shared/DifficultySelector'
import VictoryScreen from '@/components/game-shared/VictoryScreen'
import { useState } from 'react'

export default function TrainTracks() {
  const { state, toggleCell, setDifficulty, nextPuzzle, resetPuzzle } = useTrainTracks('easy')

  // Estado para controlar cuándo mostrar la pantalla de victoria (después de la animación del tren)
  const [showVictory, setShowVictory] = useState(false)

  // Hook para animar el tren al completarse la vía
  useTrainAnimation({
    isVictory: state.isVictory,
    solution: state.puzzle.solution,
    onComplete: () => {
      setShowVictory(true)
    },
  })

  const handleDifficultyChange = (diff: any) => {
    setShowVictory(false)
    setDifficulty(diff)
  }

  const handleReset = () => {
    setShowVictory(false)
    resetPuzzle()
  }

  const handleNext = () => {
    setShowVictory(false)
    nextPuzzle()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 'var(--space-6)',
      }}
    >
      {/* Header Widget */}
      <GameHeaderWidget
        title="Train Tracks"
        difficulty={
          state.difficulty === 'easy'
            ? 'Fácil'
            : state.difficulty === 'medium'
              ? 'Medio'
              : state.difficulty === 'hard'
                ? 'Difícil'
                : 'Experto'
        }
        time={state.time}
        onReset={handleReset}
      />

      {/* Selector de dificultad */}
      <DifficultySelector current={state.difficulty} onChange={handleDifficultyChange} />

      {/* Tablero SVG */}
      <Board
        grid={state.grid}
        puzzle={state.puzzle}
        validation={state.validation}
        onCellClick={toggleCell}
      />

      {/* Instrucciones sutiles */}
      <p
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          maxWidth: '40ch',
          lineHeight: 1.5,
          marginTop: 'var(--space-4)',
        }}
      >
        Toca celdas vacías para ciclar entre: Vía → Bloqueado (X) → Vacío. Dibuja una línea continua de A a B.
      </p>

      {/* Pantalla de Victoria Overlay */}
      {showVictory && <VictoryScreen time={state.time} onNext={handleNext} onReset={handleReset} />}
    </div>
  )
}
