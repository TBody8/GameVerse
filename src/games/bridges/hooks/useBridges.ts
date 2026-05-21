import { useReducer, useEffect } from 'react'
import { Difficulty } from '@/types/game'
import { Puzzle, Bridge, ValidationResult } from '../logic/types'
import { generateBridgesPuzzle } from '../logic/generator'
import { validateBridges } from '../logic/validator'

interface GameState {
  difficulty: Difficulty
  puzzle: Puzzle
  bridges: Bridge[]
  validation: ValidationResult
  time: number
  moves: number
  isVictory: boolean
  hintedIslandId: string | null
  selectedIslandId: string | null
}

type Action =
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'SELECT_ISLAND'; payload: string }
  | { type: 'TOGGLE_BRIDGE'; from: string; to: string }
  | { type: 'RESET' }
  | { type: 'NEXT' }
  | { type: 'APPLY_HINT' }
  | { type: 'CLEAR_HINT' }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'TICK' }

function isPathBlocked(puzzle: Puzzle, fromId: string, toId: string): boolean {
  const fIsl = puzzle.islands.find(i => i.id === fromId)
  const tIsl = puzzle.islands.find(i => i.id === toId)
  if (!fIsl || !tIsl) return true

  const minRow = Math.min(fIsl.pos.row, tIsl.pos.row)
  const maxRow = Math.max(fIsl.pos.row, tIsl.pos.row)
  const minCol = Math.min(fIsl.pos.col, tIsl.pos.col)
  const maxCol = Math.max(fIsl.pos.col, tIsl.pos.col)

  for (const isl of puzzle.islands) {
    if (isl.id === fromId || isl.id === toId) continue
    if (fIsl.pos.row === tIsl.pos.row && isl.pos.row === fIsl.pos.row && isl.pos.col > minCol && isl.pos.col < maxCol) {
      return true
    }
    if (fIsl.pos.col === tIsl.pos.col && isl.pos.col === fIsl.pos.col && isl.pos.row > minRow && isl.pos.row < maxRow) {
      return true
    }
  }
  return false
}

function getBridgeId(id1: string, id2: string): string {
  return [id1, id2].sort().join('_')
}

function toggleBridgeLogic(state: GameState, from: string, to: string, keepSelection: boolean = false): GameState {
  const fIsl = state.puzzle.islands.find(i => i.id === from)
  const tIsl = state.puzzle.islands.find(i => i.id === to)
  if (!fIsl || !tIsl) return { ...state, selectedIslandId: null }

  if (isPathBlocked(state.puzzle, from, to)) return { ...state, selectedIslandId: null }

  const isVert = fIsl.pos.col === tIsl.pos.col
  const isHorz = fIsl.pos.row === tIsl.pos.row
  if (!isVert && !isHorz) return { ...state, selectedIslandId: null }

  const bId = getBridgeId(from, to)
  const newBridges = state.bridges.map(b => ({ ...b }))
  const existing = newBridges.findIndex(b => b.id === bId)

  if (existing >= 0) {
    if (newBridges[existing].count === 1) {
      newBridges[existing] = { ...newBridges[existing], count: 2 }
    } else {
      newBridges.splice(existing, 1)
    }
  } else {
    newBridges.push({
      id: bId,
      from,
      to,
      count: 1,
      isVertical: isVert
    })
  }

  const val = validateBridges(state.puzzle, newBridges)

  return {
    ...state,
    bridges: newBridges,
    validation: val,
    moves: state.moves + 1,
    isVictory: val.isVictory,
    hintedIslandId: null,
    selectedIslandId: keepSelection ? to : null
  }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload || state
    case 'SET_DIFFICULTY': {
      if (action.payload === state.difficulty) {
        return { ...state, selectedIslandId: null }
      }
      
      // Guardar progreso actual antes de cambiar
      if (state.moves > 0 && !state.isVictory) {
        try {
          localStorage.setItem(`gameverse_bridges_save_${state.difficulty}`, JSON.stringify(state))
        } catch {}
      } else if (state.isVictory) {
        try {
          localStorage.removeItem(`gameverse_bridges_save_${state.difficulty}`)
        } catch {}
      }
      
      // Intentar recuperar el progreso de la nueva dificultad elegida
      try {
        const saved = localStorage.getItem(`gameverse_bridges_save_${action.payload}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.puzzle) {
            // Deseleccionar al volver a cargar
            return { ...parsed, selectedIslandId: null } as GameState
          }
        }
      } catch (e) {}

      // Si no había partida guardada, generar un puzzle nuevo
      const p = generateBridgesPuzzle(action.payload)
      return {
        ...state,
        difficulty: action.payload,
        puzzle: p,
        bridges: [],
        validation: validateBridges(p, []),
        time: 0,
        moves: 0,
        isVictory: false,
        hintedIslandId: null,
        selectedIslandId: null
      }
    }
    case 'NEXT':
    case 'RESET': {
      const p = action.type === 'NEXT' ? generateBridgesPuzzle(state.difficulty) : state.puzzle
      return {
        ...state,
        puzzle: p,
        bridges: [],
        validation: validateBridges(p, []),
        time: 0,
        moves: 0,
        isVictory: false,
        hintedIslandId: null,
        selectedIslandId: null
      }
    }
    case 'SELECT_ISLAND': {
      if (state.isVictory) return state
      const clickedId = action.payload

      if (state.selectedIslandId) {
        if (state.selectedIslandId === clickedId) {
          return { ...state, selectedIslandId: null }
        }

        const from = state.selectedIslandId
        const to = clickedId
        const fIsl = state.puzzle.islands.find(i => i.id === from)
        const tIsl = state.puzzle.islands.find(i => i.id === to)

        if (!fIsl || !tIsl) return { ...state, selectedIslandId: clickedId }

        const aligned = fIsl.pos.row === tIsl.pos.row || fIsl.pos.col === tIsl.pos.col
        if (!aligned) {
          return { ...state, selectedIslandId: clickedId }
        }

        if (isPathBlocked(state.puzzle, from, to)) {
          return { ...state, selectedIslandId: clickedId }
        }

        return toggleBridgeLogic(state, from, to, true)
      }

      return { ...state, selectedIslandId: clickedId }
    }
    case 'TOGGLE_BRIDGE': {
      if (state.isVictory) return state
      return toggleBridgeLogic(state, action.from, action.to)
    }
    case 'APPLY_HINT': {
      if (state.isVictory) return state

      // 1. Fase de Detección de Errores:
      // Comparamos los puentes actuales con la solución original.
      // Si el jugador ha puesto un puente que no existe en la solución o con un count mayor al real,
      // marcamos ESE puente como un error para que lo corrija.
      for (const currentBridge of state.bridges) {
        const solutionBridge = state.puzzle.solution.find(s => s.id === currentBridge.id)
        if (!solutionBridge || currentBridge.count > solutionBridge.count) {
          // Generamos un ID de hint con el formato 'error_{bridgeId}_{timestamp}'
          return { ...state, hintedIslandId: `error_${currentBridge.id}_${Date.now()}` }
        }
      }

      // 2. Fase de Sugerencia de Conexión:
      // Si no hay errores, buscamos un puente en la solución que el jugador AÚN NO haya puesto.
      for (const solutionBridge of state.puzzle.solution) {
        const currentBridge = state.bridges.find(b => b.id === solutionBridge.id)
        if (!currentBridge || currentBridge.count < solutionBridge.count) {
          // Sugerimos que preste atención a estas dos islas, con el formato 'pair_{island1}_{island2}_{timestamp}'
          return { ...state, hintedIslandId: `pair_${solutionBridge.from}_${solutionBridge.to}_${Date.now()}` }
        }
      }

      return state
    }
    case 'CLEAR_HINT':
      return { ...state, hintedIslandId: null }
    case 'TICK':
      return state.isVictory ? state : { ...state, time: state.time + 1 }
    default:
      return state
  }
}

export function useBridges(initialDifficulty: Difficulty = 'easy') {
  const [state, dispatch] = useReducer(reducer, null as any, () => {
    try {
      const saved = localStorage.getItem(`gameverse_bridges_save_${initialDifficulty}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.puzzle) return parsed as GameState
      }
    } catch (e) {}
    const p = generateBridgesPuzzle(initialDifficulty)
    return {
      difficulty: initialDifficulty,
      puzzle: p,
      bridges: [],
      validation: validateBridges(p, []),
      time: 0,
      moves: 0,
      isVictory: false,
      hintedIslandId: null,
      selectedIslandId: null
    }
  })

  useEffect(() => {
    if (state.isVictory) return
    const t = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(t)
  }, [state.isVictory])

  const saveProgress = () => {
    try {
      localStorage.setItem(`gameverse_bridges_save_${state.difficulty}`, JSON.stringify(state))
    } catch {}
  }

  const clearProgress = () => {
    try {
      localStorage.removeItem(`gameverse_bridges_save_${state.difficulty}`)
    } catch {}
  }

  return {
    state,
    setDifficulty: (d: Difficulty) => {
      dispatch({ type: 'SET_DIFFICULTY', payload: d })
    },
    selectIsland: (id: string) => dispatch({ type: 'SELECT_ISLAND', payload: id }),
    toggleBridge: (from: string, to: string) => dispatch({ type: 'TOGGLE_BRIDGE', from, to }),
    resetPuzzle: () => dispatch({ type: 'RESET' }),
    nextPuzzle: () => {
      clearProgress()
      dispatch({ type: 'NEXT' })
    },
    applyHint: () => dispatch({ type: 'APPLY_HINT' }),
    saveProgress,
    clearProgress
  }
}
