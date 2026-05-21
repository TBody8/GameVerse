import { useReducer, useEffect } from 'react'
import { type CellState, type Puzzle, type Difficulty, type Position } from '../logic/types'
import { generatePuzzle } from '../logic/generator'
import { validatePuzzle, type ValidationResult } from '../logic/validator'

interface GameState {
  difficulty: Difficulty
  puzzleIndex: number
  puzzle: Puzzle
  grid: CellState[][]
  validation: ValidationResult
  isVictory: boolean
  time: number
  isRunning: boolean
  hintedCell: Position | null
  moves: number
}

type GameAction =
  | { type: 'TOGGLE_CELL'; row: number; col: number }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'NEXT_PUZZLE' }
  | { type: 'RESET_PUZZLE' }
  | { type: 'APPLY_HINT' }
  | { type: 'CLEAR_HINT' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'TICK' }

function createNewPuzzleState(difficulty: Difficulty): GameState {
  const puzzle = generatePuzzle(difficulty)
  const grid = Array.from({ length: puzzle.gridSize }, () => Array(puzzle.gridSize).fill('empty' as CellState))
  
  // Aplicar celdas iniciales reveladas
  for (const revealed of puzzle.initialRevealed) {
    grid[revealed.row][revealed.col] = revealed.state
  }
  
  const validation = validatePuzzle(grid, puzzle)

  return {
    difficulty,
    puzzleIndex: 0,
    puzzle,
    grid,
    validation,
    isVictory: false,
    time: 0,
    isRunning: true,
    hintedCell: null,
    moves: 0,
  }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.state

    case 'TOGGLE_CELL': {
      if (state.isVictory) return state

      const { row, col } = action
      // Las celdas iniciales reveladas no se pueden cambiar
      const isFixed = state.puzzle.initialRevealed.some(p => p.row === row && p.col === col)
      if (isFixed) return state

      const newGrid = state.grid.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col) {
            if (c === 'empty') return 'water'
            if (c === 'water') return 'ship'
            return 'empty'
          }
          return c
        })
      )

      const validation = validatePuzzle(newGrid, state.puzzle)
      const isVictory = validation.isValid

      return {
        ...state,
        grid: newGrid,
        validation,
        isVictory,
        isRunning: !isVictory,
        hintedCell: null,
        moves: state.moves + 1,
      }
    }

    case 'APPLY_HINT': {
      if (state.isVictory) return state
      
      const newGrid = state.grid.map(row => [...row])
      const solution = state.puzzle.solution
      let changed = false
      let targetCell: Position | null = null

      // 1. Quitar un barco o agua mal puesto
      for (let r = 0; r < state.puzzle.gridSize; r++) {
        for (let c = 0; c < state.puzzle.gridSize; c++) {
          const isFixed = state.puzzle.initialRevealed.some(p => p.row === r && p.col === c)
          if (!isFixed && newGrid[r][c] !== 'empty' && newGrid[r][c] !== solution[r][c]) {
            newGrid[r][c] = solution[r][c] // Corregimos al valor real de la solucion (agua o barco)
            changed = true
            targetCell = { row: r, col: c }
            break
          }
        }
        if (changed) break
      }

      // 2. Si no había errores, revelar una celda que esté vacía
      if (!changed) {
        // Find all empty cells
        const emptyCells: Position[] = []
        for (let r = 0; r < state.puzzle.gridSize; r++) {
          for (let c = 0; c < state.puzzle.gridSize; c++) {
            if (newGrid[r][c] === 'empty') {
              emptyCells.push({ row: r, col: c })
            }
          }
        }

        if (emptyCells.length > 0) {
          // Revelar barco primero si hay alguno vacío, si no revelar agua
          const emptyShips = emptyCells.filter(pos => solution[pos.row][pos.col] === 'ship')
          const pos = emptyShips.length > 0 
            ? emptyShips[Math.floor(Math.random() * emptyShips.length)]
            : emptyCells[Math.floor(Math.random() * emptyCells.length)]
            
          newGrid[pos.row][pos.col] = solution[pos.row][pos.col]
          changed = true
          targetCell = pos
        }
      }

      if (changed) {
        const validation = validatePuzzle(newGrid, state.puzzle)
        return {
          ...state,
          grid: newGrid,
          validation,
          isVictory: validation.isValid,
          isRunning: !validation.isValid,
          hintedCell: targetCell,
          moves: state.moves + 1,
        }
      }

      return state
    }

    case 'CLEAR_HINT': {
      return {
        ...state,
        hintedCell: null,
      }
    }

    case 'SET_DIFFICULTY': {
      try {
        const saved = localStorage.getItem(`gameverse_battleships_save_${action.difficulty}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.puzzle && parsed.grid) {
            return parsed as GameState
          }
        }
      } catch (e) {}
      return createNewPuzzleState(action.difficulty)
    }

    case 'NEXT_PUZZLE': {
      return createNewPuzzleState(state.difficulty)
    }

    case 'RESET_PUZZLE': {
      const grid = Array.from({ length: state.puzzle.gridSize }, () => Array(state.puzzle.gridSize).fill('empty' as CellState))
      for (const revealed of state.puzzle.initialRevealed) {
        grid[revealed.row][revealed.col] = revealed.state
      }
      const validation = validatePuzzle(grid, state.puzzle)

      return {
        ...state,
        grid,
        validation,
        isVictory: false,
        time: 0,
        isRunning: true,
        hintedCell: null,
      }
    }

    case 'TICK': {
      if (!state.isRunning) return state
      return {
        ...state,
        time: state.time + 1,
      }
    }

    default:
      return state
  }
}

export function useBattleships(initialDifficulty: Difficulty = 'easy') {
  const [state, dispatch] = useReducer(gameReducer, null as any, () => {
    try {
      const saved = localStorage.getItem(`gameverse_battleships_save_${initialDifficulty}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.puzzle && parsed.grid) {
          return parsed as GameState
        }
      }
    } catch (e) {
      console.error("Failed to load save", e)
    }
    return createNewPuzzleState(initialDifficulty)
  })

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isRunning])

  const saveProgress = () => {
    localStorage.setItem(`gameverse_battleships_save_${state.difficulty}`, JSON.stringify(state))
  }

  const clearProgress = () => {
    localStorage.removeItem(`gameverse_battleships_save_${state.difficulty}`)
  }

  return {
    state,
    toggleCell: (row: number, col: number) => dispatch({ type: 'TOGGLE_CELL', row, col }),
    setDifficulty: (difficulty: Difficulty) => {
      if (state.moves > 0 && !state.isVictory) {
        saveProgress()
      } else if (state.isVictory) {
        clearProgress()
      }
      dispatch({ type: 'SET_DIFFICULTY', difficulty })
    },
    nextPuzzle: () => {
      clearProgress()
      dispatch({ type: 'NEXT_PUZZLE' })
    },
    resetPuzzle: () => dispatch({ type: 'RESET_PUZZLE' }),
    applyHint: () => dispatch({ type: 'APPLY_HINT' }),
    saveProgress,
    clearProgress
  }
}
