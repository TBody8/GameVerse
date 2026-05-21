import { useReducer, useEffect } from 'react'
import { type CellState, type Puzzle, type Difficulty, type Position } from '../logic/types'
import { generatePuzzle } from '../logic/generator'
import { validatePuzzle, type ValidationResult } from '../logic/validator'

interface GameState {
  difficulty: Difficulty
  puzzleIndex: number
  puzzle: Puzzle
  grid: CellState[][]
  connections: Record<string, string[]>
  history: string[]
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
  
  const startKey = `${puzzle.start.row},${puzzle.start.col}`
  const endKey = `${puzzle.end.row},${puzzle.end.col}`
  
  const connections: Record<string, string[]> = {
    [startKey]: [],
    [endKey]: []
  }
  const history = [startKey, endKey]

  const validation = validatePuzzle(grid, puzzle, connections)

  return {
    difficulty,
    puzzleIndex: 0,
    puzzle,
    grid,
    connections,
    history,
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

      const newGrid = state.grid.map(r => [...r])
      const newConnections = { ...state.connections }
      const newHistory = [...state.history]
      const key = `${row},${col}`

      if (state.grid[row][col] === 'empty') {
        newGrid[row][col] = 'track'
        newHistory.push(key)
        newConnections[key] = []

        const dirs = [[-1,0], [1,0], [0,-1], [0,1]]
        const validNeighbors: string[] = []
        for (const [dr, dc] of dirs) {
          const nr = row + dr, nc = col + dc
          if (nr >= 0 && nr < state.puzzle.gridSize && nc >= 0 && nc < state.puzzle.gridSize) {
            const nKey = `${nr},${nc}`
            if (newGrid[nr][nc] === 'track' || newGrid[nr][nc] === 'overpass') {
              const isNStart = nr === state.puzzle.start.row && nc === state.puzzle.start.col
              const isNEnd = nr === state.puzzle.end.row && nc === state.puzzle.end.col
              const maxConns = (isNStart || isNEnd) ? 1 : (newGrid[nr][nc] === 'overpass' ? 4 : 2)
              if ((newConnections[nKey]?.length || 0) < maxConns) {
                validNeighbors.push(nKey)
              }
            }
          }
        }
        validNeighbors.sort((a, b) => newHistory.indexOf(b) - newHistory.indexOf(a))
        const toConnect = validNeighbors.slice(0, 2)
        for (const nKey of toConnect) {
          newConnections[key].push(nKey)
          newConnections[nKey] = [...(newConnections[nKey] || []), key]
        }

      } else if (state.grid[row][col] === 'track') {
        const lastKey = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null
        let isDrawingInto = false
        if (lastKey && lastKey !== key) {
           const [lrStr, lcStr] = lastKey.split(',')
           const lr = parseInt(lrStr, 10), lc = parseInt(lcStr, 10)
           const dist = Math.abs(lr - row) + Math.abs(lc - col)
           if (dist === 1) {
              isDrawingInto = true
           }
        }

        if (isDrawingInto) {
          newGrid[row][col] = 'overpass'
          const dirs = [[-1,0], [1,0], [0,-1], [0,1]]
          const validNeighbors: string[] = []
          for (const [dr, dc] of dirs) {
            const nr = row + dr, nc = col + dc
            if (nr >= 0 && nr < state.puzzle.gridSize && nc >= 0 && nc < state.puzzle.gridSize) {
              const nKey = `${nr},${nc}`
              if ((newGrid[nr][nc] === 'track' || newGrid[nr][nc] === 'overpass' || (nr === state.puzzle.start.row && nc === state.puzzle.start.col) || (nr === state.puzzle.end.row && nc === state.puzzle.end.col)) && !newConnections[key]?.includes(nKey)) {
                const isNStart = nr === state.puzzle.start.row && nc === state.puzzle.start.col
                const isNEnd = nr === state.puzzle.end.row && nc === state.puzzle.end.col
                const maxConns = (isNStart || isNEnd) ? 1 : (newGrid[nr][nc] === 'overpass' ? 4 : 2)
                if ((newConnections[nKey]?.length || 0) < maxConns) {
                  validNeighbors.push(nKey)
                }
              }
            }
          }
          validNeighbors.sort((a, b) => newHistory.indexOf(b) - newHistory.indexOf(a))
          const toConnect = validNeighbors.slice(0, 4 - (newConnections[key]?.length || 0))
          for (const nKey of toConnect) {
            newConnections[key].push(nKey)
            newConnections[nKey] = [...(newConnections[nKey] || []), key]
          }
          // Actualizamos el historial
          const hIdx = newHistory.indexOf(key)
          if (hIdx >= 0) newHistory.splice(hIdx, 1)
          newHistory.push(key)

        } else {
          // Fallthrough to blocked
          newGrid[row][col] = 'blocked'
          const conns = newConnections[key] || []
          for (const nKey of conns) {
            if (newConnections[nKey]) {
              newConnections[nKey] = newConnections[nKey].filter(k => k !== key)
            }
          }
          delete newConnections[key]
          const hIdx = newHistory.indexOf(key)
          if (hIdx >= 0) newHistory.splice(hIdx, 1)

          // Auto-Heal neighbors
          for (const nKey of conns) {
            const [nrStr, ncStr] = nKey.split(',')
            const nr = parseInt(nrStr, 10), nc = parseInt(ncStr, 10)
            const isNStart = nr === state.puzzle.start.row && nc === state.puzzle.start.col
            const isNEnd = nr === state.puzzle.end.row && nc === state.puzzle.end.col
            const nMax = (isNStart || isNEnd) ? 1 : (newGrid[nr][nc] === 'overpass' ? 4 : 2)
            
            const needed = nMax - (newConnections[nKey]?.length || 0)
            if (needed > 0) {
              const dirs = [[-1,0], [1,0], [0,-1], [0,1]]
              const healCands: string[] = []
              for (const [dr, dc] of dirs) {
                const nnr = nr + dr, nnc = nc + dc
                if (nnr >= 0 && nnr < state.puzzle.gridSize && nnc >= 0 && nnc < state.puzzle.gridSize) {
                  const nnKey = `${nnr},${nnc}`
                  if (nnKey !== key && !newConnections[nKey].includes(nnKey)) {
                    if (newGrid[nnr][nnc] === 'track' || newGrid[nnr][nnc] === 'overpass' || (nnr === state.puzzle.start.row && nnc === state.puzzle.start.col) || (nnr === state.puzzle.end.row && nnc === state.puzzle.end.col)) {
                      const isNNStart = nnr === state.puzzle.start.row && nnc === state.puzzle.start.col
                      const isNNEnd = nnr === state.puzzle.end.row && nnc === state.puzzle.end.col
                      const nnMax = (isNNStart || isNNEnd) ? 1 : (newGrid[nnr][nnc] === 'overpass' ? 4 : 2)
                      if ((newConnections[nnKey]?.length || 0) < nnMax) {
                        healCands.push(nnKey)
                      }
                    }
                  }
                }
              }
              healCands.sort((a, b) => newHistory.indexOf(b) - newHistory.indexOf(a))
              const toHeal = healCands.slice(0, needed)
              for (const hKey of toHeal) {
                newConnections[nKey].push(hKey)
                newConnections[hKey] = [...(newConnections[hKey] || []), nKey]
              }
            }
          }
        }

      } else if (state.grid[row][col] === 'overpass') {
        newGrid[row][col] = 'blocked'
        const conns = newConnections[key] || []
        for (const nKey of conns) {
          if (newConnections[nKey]) {
            newConnections[nKey] = newConnections[nKey].filter(k => k !== key)
          }
        }
        delete newConnections[key]
        const hIdx = newHistory.indexOf(key)
        if (hIdx >= 0) newHistory.splice(hIdx, 1)

        // Auto-Heal neighbors
        for (const nKey of conns) {
          const [nrStr, ncStr] = nKey.split(',')
          const nr = parseInt(nrStr, 10), nc = parseInt(ncStr, 10)
          const isNStart = nr === state.puzzle.start.row && nc === state.puzzle.start.col
          const isNEnd = nr === state.puzzle.end.row && nc === state.puzzle.end.col
          const nMax = (isNStart || isNEnd) ? 1 : (newGrid[nr][nc] === 'overpass' ? 4 : 2)
          
          const needed = nMax - (newConnections[nKey]?.length || 0)
          if (needed > 0) {
            const dirs = [[-1,0], [1,0], [0,-1], [0,1]]
            const healCands: string[] = []
            for (const [dr, dc] of dirs) {
              const nnr = nr + dr, nnc = nc + dc
              if (nnr >= 0 && nnr < state.puzzle.gridSize && nnc >= 0 && nnc < state.puzzle.gridSize) {
                const nnKey = `${nnr},${nnc}`
                if (nnKey !== key && !newConnections[nKey].includes(nnKey)) {
                  if (newGrid[nnr][nnc] === 'track' || newGrid[nnr][nnc] === 'overpass' || (nnr === state.puzzle.start.row && nnc === state.puzzle.start.col) || (nnr === state.puzzle.end.row && nnc === state.puzzle.end.col)) {
                    const isNNStart = nnr === state.puzzle.start.row && nnc === state.puzzle.start.col
                    const isNNEnd = nnr === state.puzzle.end.row && nnc === state.puzzle.end.col
                    const nnMax = (isNNStart || isNNEnd) ? 1 : (newGrid[nnr][nnc] === 'overpass' ? 4 : 2)
                    if ((newConnections[nnKey]?.length || 0) < nnMax) {
                      healCands.push(nnKey)
                    }
                  }
                }
              }
            }
            healCands.sort((a, b) => newHistory.indexOf(b) - newHistory.indexOf(a))
            const toHeal = healCands.slice(0, needed)
            for (const hKey of toHeal) {
              newConnections[nKey].push(hKey)
              newConnections[hKey] = [...(newConnections[hKey] || []), nKey]
            }
          }
        }
      } else {
        newGrid[row][col] = 'empty'
      }

      const validation = validatePuzzle(newGrid, state.puzzle, newConnections)
      const isVictory = validation.isValid

      return {
        ...state,
        grid: newGrid,
        connections: newConnections,
        history: newHistory,
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
        // Recalcular conexiones simplificadas para el hint (sin overpass por ahora, para no liar)
        // Solo para que el validador y UI lo procesen si aplica.
        // Lo ideal es reconstruir el camino del hint... pero para no complicar el código
        // podemos simplemente reconstruir connections desde la solution.
        const newConnections: Record<string, string[]> = {}
        const newHistory: string[] = []
        for (const pos of solution) {
           const k = `${pos.row},${pos.col}`
           if (newGrid[pos.row][pos.col] === 'track') {
             newConnections[k] = []
             newHistory.push(k)
           }
        }
        for (let i = 0; i < solution.length - 1; i++) {
           const k1 = `${solution[i].row},${solution[i].col}`
           const k2 = `${solution[i+1].row},${solution[i+1].col}`
           if (newGrid[solution[i].row][solution[i].col] === 'track' && newGrid[solution[i+1].row][solution[i+1].col] === 'track') {
             if (!newConnections[k1].includes(k2)) newConnections[k1].push(k2)
             if (!newConnections[k2].includes(k1)) newConnections[k2].push(k1)
           }
        }
        // añadir start y end vacios si no están
        const sKey = `${state.puzzle.start.row},${state.puzzle.start.col}`
        const eKey = `${state.puzzle.end.row},${state.puzzle.end.col}`
        if (!newConnections[sKey]) newConnections[sKey] = []
        if (!newConnections[eKey]) newConnections[eKey] = []

        const validation = validatePuzzle(newGrid, state.puzzle, newConnections)
        return {
          ...state,
          grid: newGrid,
          connections: newConnections,
          history: newHistory,
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
          if (parsed && parsed.puzzle && parsed.grid && parsed.connections && parsed.history) {
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
      const startKey = `${state.puzzle.start.row},${state.puzzle.start.col}`
      const endKey = `${state.puzzle.end.row},${state.puzzle.end.col}`
      const connections: Record<string, string[]> = { [startKey]: [], [endKey]: [] }
      const history = [startKey, endKey]
      
      const validation = validatePuzzle(grid, state.puzzle, connections)

      return {
        ...state,
        grid,
        connections,
        history,
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
        if (parsed && parsed.puzzle && parsed.grid && parsed.connections && parsed.history) {
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
