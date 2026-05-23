import { useKakuro } from './hooks/useKakuro'
import { Board } from './components/Board'
import { NumberPad } from './components/NumberPad'
import DifficultySelector from '@/components/game-shared/DifficultySelector'
import GameHeaderWidget from '@/components/game-shared/GameHeader'
import VictoryScreen from '@/components/game-shared/VictoryScreen'
import GameInfoModal from '@/components/game-shared/GameInfoModal'
import { useState, useEffect } from 'react'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Kakuro() {
  useLingui()
  const { state, setCell, setDifficulty, nextPuzzle, resetPuzzle, applyHint, saveProgress, clearProgress } = useKakuro('easy')
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [showVictory, setShowVictory] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const { navigateWithTransition } = usePageTransition()

  const KAKURO_RULES = [
    {
      title: t`Objetivo`,
      content: [
        t`Rellena las casillas blancas con números del 1 al 9.`,
        t`La suma de cada bloque debe coincidir con la pista dada.`,
      ]
    },
    {
      title: t`Restricciones`,
      content: [
        t`En un mismo bloque continuo de suma, NO se puede repetir el mismo número.`,
        t`Las pistas diagonales indican sumas horizontales (arriba a la derecha) o verticales (abajo a la izquierda).`,
      ]
    },
    {
      title: t`Controles`,
      content: [
        t`Toca una celda blanca para seleccionarla.`,
        t`Usa el teclado numérico en pantalla o el físico para introducir números.`,
        t`Usa el botón de borrar (o Backspace) para vaciar una celda.`
      ]
    }
  ]

  useEffect(() => {
    if (state.isVictory) {
      const timer = setTimeout(() => setShowVictory(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowVictory(false)
    }
  }, [state.isVictory])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showVictory || showInfo || !selectedCell) return
      
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= 9) {
        setCell(selectedCell.row, selectedCell.col, num)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        setCell(selectedCell.row, selectedCell.col, undefined)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, showVictory, showInfo, setCell])

  const handleDifficultyChange = (diff: any) => {
    setShowVictory(false)
    setSelectedCell(null)
    setDifficulty(diff)
  }

  const handleReset = () => {
    setShowVictory(false)
    setSelectedCell(null)
    resetPuzzle()
  }

  const handleNext = () => {
    setShowVictory(false)
    setSelectedCell(null)
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
        gap: 'var(--space-4)',
        position: 'relative',
      } as React.CSSProperties}
    >
      <GameHeaderWidget
        title="Kakuro"
        difficulty={
          state.difficulty === 'easy' ? t`6x6` :
          state.difficulty === 'medium' ? t`8x8` :
          state.difficulty === 'hard' ? t`10x10` : t`12x12`
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
        onChange={handleDifficultyChange}
        labels={{ easy: '6x6', medium: '8x8', hard: '10x10', expert: '12x12' }}
      />

      {/* Override global theme variables for Kakuro (Dark Papyrus) ONLY on the grid */}
      <div style={{
        '--color-accent': '#F59E0B',
        '--color-accent-hover': '#D97706',
        '--color-accent-subtle': 'rgba(245, 158, 11, 0.12)',
        '--color-accent-text': '#FCD34D',
        '--color-border': 'rgba(225, 200, 150, 0.08)',
        '--color-border-subtle': 'rgba(225, 200, 150, 0.04)',
        '--color-surface': 'rgba(225, 200, 150, 0.01)',
        '--shadow-neon-glow': '0 0 16px rgba(245, 158, 11, 0.15), 0 0 4px rgba(245, 158, 11, 0.05)',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center'
      } as React.CSSProperties}>
        <Board
          grid={state.grid}
          gridSize={state.puzzle.gridSize}
          validation={state.validation}
          hintedCell={state.hintedCell}
          selectedCell={selectedCell}
          onCellClick={(r, c) => {
            if (state.grid[r][c].type === 'playable') {
              setSelectedCell({ row: r, col: c })
            }
          }}
        />
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <NumberPad 
          onSelect={(num) => {
            if (selectedCell) {
              setCell(selectedCell.row, selectedCell.col, num)
            }
          }} 
        />
      </div>

      <p
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          maxWidth: '40ch',
          lineHeight: 1.5,
          marginTop: 'var(--space-2)',
        }}
      >
        {t`Selecciona una casilla y usa el teclado o los botones para introducir un número del 1 al 9.`}
      </p>

      {showInfo && (
        <GameInfoModal
          gameName="Kakuro"
          sections={KAKURO_RULES}
          onClose={() => setShowInfo(false)}
        />
      )}

      {showVictory && (
        <VictoryScreen 
          time={state.time} 
          onNext={handleNext} 
          onReset={handleReset} 
          gameId="kakuro" 
          difficulty={state.difficulty} 
          message={t`¡Has completado el Kakuro correctamente!`} 
        />
      )}
    </div>
  )
}
