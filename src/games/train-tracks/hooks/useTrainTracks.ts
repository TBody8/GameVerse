import { useReducer, useEffect } from 'react'
import { type CellState, type Puzzle, type Difficulty, type Position } from '../logic/types'
import { trainTracksPuzzles } from '../data/puzzles'
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
}

type GameAction =
  | { type: 'TOGGLE_CELL'; row: number; col: number }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'NEXT_PUZZLE' }
  | { type: 'RESET_PUZZLE' }
  | { type: 'TICK' }

function createInitialGrid(size: number, start: Position, end: Position): CellState[][] {
  const grid = Array.from({ length: size }, () => Array(size).fill('empty'))
  // Pistas iniciales fijas: estaciones A y B
  grid[start.row][start.col] = 'track'
  grid[end.row][end.col] = 'track'
  return grid
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
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
      }
    }

    case 'SET_DIFFICULTY': {
      const puzzles = trainTracksPuzzles[action.difficulty]
      const puzzle = puzzles[0]
      const grid = createInitialGrid(puzzle.gridSize, puzzle.start, puzzle.end)
      const validation = validatePuzzle(grid, puzzle)

      return {
        ...state,
        difficulty: action.difficulty,
        puzzleIndex: 0,
        puzzle,
        grid,
        validation,
        isVictory: false,
        time: 0,
        isRunning: true,
      }
    }

    case 'NEXT_PUZZLE': {
      const puzzles = trainTracksPuzzles[state.difficulty]
      const nextIndex = (state.puzzleIndex + 1) % puzzles.length
      const puzzle = puzzles[nextIndex]
      const grid = createInitialGrid(puzzle.gridSize, puzzle.start, puzzle.end)
      const validation = validatePuzzle(grid, puzzle)

      return {
        ...state,
        puzzleIndex: nextIndex,
        puzzle,
        grid,
        validation,
        isVictory: false,
        time: 0,
        isRunning: true,
      }
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
  const puzzles = trainTracksPuzzles[initialDifficulty]
  const puzzle = puzzles[0]
  const grid = createInitialGrid(puzzle.gridSize, puzzle.start, puzzle.end)
  const validation = validatePuzzle(grid, puzzle)

  const [state, dispatch] = useReducer(gameReducer, {
    difficulty: initialDifficulty,
    puzzleIndex: 0,
    puzzle,
    grid,
    validation,
    isVictory: false,
    time: 0,
    isRunning: true,
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

  return {
    state,
    toggleCell: (row: number, col: number) => dispatch({ type: 'TOGGLE_CELL', row, col }),
    setDifficulty: (difficulty: Difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty }),
    nextPuzzle: () => dispatch({ type: 'NEXT_PUZZLE' }),
    resetPuzzle: () => dispatch({ type: 'RESET_PUZZLE' }),
  }
}
