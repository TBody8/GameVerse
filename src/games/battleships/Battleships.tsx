import { useBattleships } from './hooks/useBattleships'
import Board from './components/Board'
import GameHeaderWidget from '@/components/game-shared/GameHeader'
import DifficultySelector from '@/components/game-shared/DifficultySelector'
import VictoryScreen from '@/components/game-shared/VictoryScreen'
import GameInfoModal from '@/components/game-shared/GameInfoModal'
import { useState, useEffect } from 'react'
import { usePageTransition } from '@/components/layout/PageTransitionWrapper'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

// Subcomponente para renderizar la flota
function FleetStatus({ puzzle, fleetStatus }: any) {
  const fleetSizes = Object.keys(puzzle.fleet).map(Number).sort((a, b) => b - a)

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      backgroundColor: 'var(--color-surface-2)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      marginTop: 'var(--space-2)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-neon-glow)'
    }}>
      <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        {t`ESTADO DE LA FLOTA`}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {fleetSizes.map(size => {
          const req = puzzle.fleet[size]
          const found = fleetStatus ? (fleetStatus[size]?.found || 0) : 0
          const isComplete = found === req
          const isExceeded = found > req

          return (
            <div key={size} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: size }).map((_, i) => (
                  <div key={i} style={{
                    width: '16px', height: '16px',
                    backgroundColor: isExceeded ? 'rgba(239,68,68,0.2)' : isComplete ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                    border: `1px solid ${isExceeded ? 'var(--color-error)' : isComplete ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: '2px',
                    opacity: isComplete && !isExceeded ? 0.5 : 1
                  }} />
                ))}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: isExceeded ? 'var(--color-error)' : isComplete ? 'var(--color-accent)' : 'var(--color-text-primary)'
              }}>
                {found} / {req}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Battleships() {
  useLingui() // Suscripción activa al cambio de idioma
  const { state, toggleCell, setDifficulty, nextPuzzle, resetPuzzle, applyHint, saveProgress, clearProgress } = useBattleships('easy')
  const [showVictory, setShowVictory] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const { navigateWithTransition } = usePageTransition()

  const BATTLESHIPS_RULES = [
    {
      title: t`Objetivo`,
      content: [
        t`Encuentra la flota enemiga escondida en el océano.`,
      ]
    },
    {
      title: t`Restricciones`,
      content: [
        t`Los números indican cuántos fragmentos de barco hay EXACTAMENTE en esa fila o columna.`,
        t`Los barcos NUNCA pueden tocarse entre sí, ni siquiera en diagonal.`,
        t`Debes encontrar todos los barcos requeridos por la dificultad.`
      ]
    },
    {
      title: t`Controles`,
      content: [
        t`Toca una celda vacía para marcarla con AGUA (celda segura).`,
        t`Toca de nuevo para marcarla como BARCO (pieza encontrada).`,
        t`Toca una tercera vez para dejarla vacía de nuevo.`
      ]
    }
  ]

  // Revisar victoria directamente
  useEffect(() => {
    if (state.isVictory) {
      // Pequeño delay para saborear la victoria antes de que salte la pantalla
      const timer = setTimeout(() => setShowVictory(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowVictory(false)
    }
  }, [state.isVictory])

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
        position: 'relative',
      } as React.CSSProperties}
    >
      <GameHeaderWidget
        title="Battleships"
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
        onChange={handleDifficultyChange}
        labels={{ easy: '4x4', medium: '6x6', hard: '8x8', expert: '10x10' }}
      />

      {/* Contenedor aislado para el color Cian Táctico solo en la cuadrícula */}
      <div style={{
        '--color-accent': '#06B6D4', // cyan-500
        '--color-accent-hover': '#0891B2', // cyan-600
        '--color-accent-subtle': 'rgba(6, 182, 212, 0.15)',
        '--color-accent-text': '#22D3EE', // cyan-400
        '--shadow-neon-glow': '0 0 16px rgba(6, 182, 212, 0.35), 0 0 4px rgba(6, 182, 212, 0.15)',
        '--shadow-neon-glow-hover': '0 0 24px rgba(6, 182, 212, 0.5), 0 0 8px rgba(6, 182, 212, 0.25)',
        '--shadow-neon-text': '0 0 8px rgba(6, 182, 212, 0.5)',
      } as React.CSSProperties}>
        <Board
          grid={state.grid}
          puzzle={state.puzzle}
          validation={state.validation}
          hintedCell={state.hintedCell}
          onCellClick={toggleCell}
        />
      </div>

      {/* Panel de Estado de la Flota */}
      <FleetStatus 
        puzzle={state.puzzle} 
        fleetStatus={state.validation.fleetStatus}
      />

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
        Toca celdas vacías para ciclar entre: Agua (ola) → Barco → Vacío. Los barcos no pueden tocarse entre sí.
      </p>

      {showInfo && (
        <GameInfoModal
          gameName="Battleships"
          sections={BATTLESHIPS_RULES}
          onClose={() => setShowInfo(false)}
        />
      )}

      {showVictory && <VictoryScreen time={state.time} onNext={handleNext} onReset={handleReset} gameId="battleships" difficulty={state.difficulty} message="¡La flota enemiga ha sido completamente hundida!" />}
    </div>
  )
}
