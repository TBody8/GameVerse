import { useTrainTracks } from './hooks/useTrainTracks'
import { useTrainAnimation } from './hooks/useTrainAnimation'
import Board from './components/Board'
import GameHeaderWidget from '@/components/game-shared/GameHeader'
import DifficultySelector from '@/components/game-shared/DifficultySelector'
import VictoryScreen from '@/components/game-shared/VictoryScreen'
import GameInfoModal from '@/components/game-shared/GameInfoModal'
import { useState, useEffect } from 'react'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function TrainTracks() {
  useLingui() // Suscripción activa al cambio de idioma
  const { state, toggleCell, setDifficulty, nextPuzzle, resetPuzzle, applyHint, saveProgress, clearProgress } = useTrainTracks('easy')
  const [showVictory, setShowVictory] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const { navigateWithTransition } = usePageTransition()

  const TRAIN_TRACKS_RULES = [
    {
      title: t`Objetivo`,
      content: [
        t`Dibuja una única vía de tren continua que conecte la estación de entrada (A) con la de salida (B).`,
      ]
    },
    {
      title: t`Restricciones`,
      content: [
        t`El número en cada fila y columna indica la cantidad EXACTA de piezas de vía que debe haber en esa línea.`,
        t`La vía no puede cruzarse a sí misma ni ramificarse.`,
        t`No pueden quedar tramos sueltos o vías muertas.`
      ]
    },
    {
      title: t`Controles`,
      content: [
        t`Toca una celda vacía para colocar un trozo de vía. (Se orientará automáticamente).`,
        t`Toca de nuevo para marcarla con una "X" (celda bloqueada/prohibida).`,
        t`Toca una tercera vez para volver a dejarla vacía.`
      ]
    }
  ]

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

  const handleBack = () => {
    if (state.moves > 0 && !state.isVictory) {
      saveProgress()
    } else if (state.isVictory || state.moves === 0) {
      clearProgress()
    }
    navigateWithTransition('/')
  }

  // Escuchar el evento del logo global GameVerse
  useEffect(() => {
    const onGlobalExitRequest = () => {
      handleBack()
    }
    window.addEventListener('request-game-exit', onGlobalExitRequest)
    return () => window.removeEventListener('request-game-exit', onGlobalExitRequest)
  }, [state.isVictory, state.moves, state.difficulty])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 'var(--space-6)',
        position: 'relative'
      }}
    >
      {/* Header Widget */}
      <GameHeaderWidget
        title="Train Tracks"
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

      {/* Selector de dificultad */}
      <DifficultySelector
        current={state.difficulty}
        onChange={handleDifficultyChange}
        labels={{ easy: '4x4', medium: '6x6', hard: '8x8', expert: '10x10' }}
      />

      {/* Tablero SVG */}
      <Board
        grid={state.grid}
        puzzle={state.puzzle}
        validation={state.validation}
        hintedCell={state.hintedCell}
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

      {/* Modales */}
      {showInfo && (
        <GameInfoModal
          gameName="Train Tracks"
          sections={TRAIN_TRACKS_RULES}
          onClose={() => setShowInfo(false)}
        />
      )}

      {/* Pantalla de Victoria Overlay */}
      {showVictory && <VictoryScreen time={state.time} onNext={handleNext} onReset={handleReset} gameId="train-tracks" difficulty={state.difficulty} message="El circuito eléctrico de las vías está cerrado." />}
    </div>
  )
}
