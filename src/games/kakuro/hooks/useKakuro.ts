import { useReducer, useEffect } from 'react'
import { Difficulty, KakuroPuzzle, KakuroCell, ValidationResult, Position } from '../logic/types'
import { generatePuzzle } from '../logic/generator'
import { validatePuzzle } from '../logic/validator'

interface GameState {
  difficulty: Difficulty
  puzzleIndex: number
  puzzle: KakuroPuzzle
  grid: KakuroCell[][]
  validation: ValidationResult
  isVictory: boolean
  time: number
  isRunning: boolean
  hintedCell: Position | null
  moves: number
}

type GameAction =
  | { type: 'SET_CELL'; row: number; col: number; value: number | undefined }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'NEXT_PUZZLE' }
  | { type: 'RESET_PUZZLE' }
  | { type: 'APPLY_HINT' }
  | { type: 'CLEAR_HINT' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'TICK' }

function createNewPuzzleState(difficulty: Difficulty): GameState {
  const puzzle = generatePuzzle(difficulty)
  // Deep copy grid
  const grid = puzzle.grid.map(row => row.map(cell => ({ ...cell })))
  
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

    case 'SET_CELL': {
      if (state.isVictory) return state

      const { row, col, value } = action
      const cell = state.grid[row][col]
      
      if (cell.type !== 'playable') return state
      
      // Toggle off if same value
      const newValue = cell.value === value ? undefined : value

      const newGrid = state.grid.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col) {
            return { ...c, value: newValue }
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
      
      const newGrid = state.grid.map(row => row.map(c => ({...c})))
      const solution = state.puzzle.solution
      let changed = false
      let targetCell: Position | null = null

      // 1. Quitar numero incorrecto
      for (let r = 0; r < state.puzzle.gridSize; r++) {
        for (let c = 0; c < state.puzzle.gridSize; c++) {
          if (newGrid[r][c].type === 'playable' && newGrid[r][c].value && newGrid[r][c].value !== solution[r][c]) {
            newGrid[r][c].value = solution[r][c]
            changed = true
            targetCell = { row: r, col: c }
            break
          }
        }
        if (changed) break
      }

      // 2. Si no habia errores, revelar una celda vacia
      if (!changed) {
        const emptyCells: Position[] = []
        for (let r = 0; r < state.puzzle.gridSize; r++) {
          for (let c = 0; c < state.puzzle.gridSize; c++) {
            if (newGrid[r][c].type === 'playable' && !newGrid[r][c].value) {
              emptyCells.push({ row: r, col: c })
            }
          }
        }

        if (emptyCells.length > 0) {
          const pos = emptyCells[Math.floor(Math.random() * emptyCells.length)]
          newGrid[pos.row][pos.col].value = solution[pos.row][pos.col]
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
        const saved = localStorage.getItem(`gameverse_kakuro_save_${action.difficulty}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.puzzle && parsed.grid && parsed.validation) {
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
      const grid = state.puzzle.grid.map(row => row.map(cell => ({ ...cell })))
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

export function useKakuro(initialDifficulty: Difficulty = 'easy') {
  const [state, dispatch] = useReducer(gameReducer, null as any, () => {
    try {
      const saved = localStorage.getItem(`gameverse_kakuro_save_${initialDifficulty}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.puzzle && parsed.grid && parsed.validation) {
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
    localStorage.setItem(`gameverse_kakuro_save_${state.difficulty}`, JSON.stringify(state))
  }

  const clearProgress = () => {
    localStorage.removeItem(`gameverse_kakuro_save_${state.difficulty}`)
  }

  return {
    state,
    setCell: (row: number, col: number, value: number | undefined) => dispatch({ type: 'SET_CELL', row, col, value }),
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
