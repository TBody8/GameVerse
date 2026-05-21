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

function createInitialGrid(size: number, start: Position, end: Position): CellState[][] {
  const grid = Array.from({ length: size }, () => Array(size).fill('empty' as CellState))
  // Pistas iniciales fijas: estaciones A y B
  grid[start.row][start.col] = 'track'
  grid[end.row][end.col] = 'track'
  return grid
}

function getGridSize(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 4
    case 'medium': return 6
    case 'hard': return 8
    case 'expert': return 10
    default: return 6
  }
}

function getMinLength(size: number): number {
  return Math.floor((size * size) * 0.4)
}

function createNewPuzzleState(difficulty: Difficulty): GameState {
  const size = getGridSize(difficulty)
  const puzzle = generatePuzzle(size, getMinLength(size))
  const grid = createInitialGrid(puzzle.gridSize, puzzle.start, puzzle.end)
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
      // Las celdas start y end son fijas
      const isStart = row === state.puzzle.start.row && col === state.puzzle.start.col
      const isEnd = row === state.puzzle.end.row && col === state.puzzle.end.col
      if (isStart || isEnd) return state

      const newGrid = state.grid.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === row && ci === col) {
            if (c === 'empty') return 'track'
            if (c === 'track') return 'blocked'
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

    case 'CLEAR_HINT': {
      return {
        ...state,
        hintedCell: null,
      }
    }

    case 'APPLY_HINT': {
      if (state.isVictory) return state
      
      const newGrid = state.grid.map(row => [...row])
      const solution = state.puzzle.solution
      let changed = false
      let targetCell: Position | null = null

      // 1. Quitar una vía sobrante que el jugador haya puesto por error
      const isSolutionCell = (r: number, c: number) => solution.some(p => p.row === r && p.col === c)
      
      for (let r = 0; r < state.puzzle.gridSize; r++) {
        for (let c = 0; c < state.puzzle.gridSize; c++) {
          if (newGrid[r][c] === 'track' && !isSolutionCell(r, c)) {
            newGrid[r][c] = 'blocked'
            changed = true
            targetCell = { row: r, col: c }
            break
          }
        }
        if (changed) break
      }

      // 2. Si no había errores, poner la siguiente vía correcta
      if (!changed) {
        for (const pos of solution) {
          if (newGrid[pos.row][pos.col] !== 'track') {
            newGrid[pos.row][pos.col] = 'track'
            changed = true
            targetCell = pos
            break
          }
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

    case 'SET_DIFFICULTY': {
      try {
        const saved = localStorage.getItem(`gameverse_traintracks_save_${action.difficulty}`)
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
      const grid = createInitialGrid(state.puzzle.gridSize, state.puzzle.start, state.puzzle.end)
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

export function useTrainTracks(initialDifficulty: Difficulty = 'easy') {
  const [state, dispatch] = useReducer(gameReducer, null as any, () => {
    try {
      const saved = localStorage.getItem(`gameverse_traintracks_save_${initialDifficulty}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.puzzle && parsed.grid) {
          return parsed as GameState
        }
      }
    } catch {
      // Corrupt or missing save — start fresh
    }
    return createNewPuzzleState(initialDifficulty)
  })

  // Timer Tick effect
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
    localStorage.setItem(`gameverse_traintracks_save_${state.difficulty}`, JSON.stringify(state))
  }

  const clearProgress = () => {
    localStorage.removeItem(`gameverse_traintracks_save_${state.difficulty}`)
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
