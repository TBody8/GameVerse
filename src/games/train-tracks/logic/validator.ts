import { type CellState, type Puzzle, type Position } from './types'

export interface ValidationResult {
  isValid: boolean
  rowStatus: ('correct' | 'exceeded' | 'incomplete')[]
  colStatus: ('correct' | 'exceeded' | 'incomplete')[]
  rules: {
    countsMatch: boolean
    singlePath: boolean
    noLoops: boolean
    noBranches: boolean
    noDeadEnds: boolean
  }
}

export function validatePuzzle(grid: CellState[][], puzzle: Puzzle, connections: Record<string, string[]>): ValidationResult {
  const size = puzzle.gridSize
  const rowCounts = puzzle.rowCounts
  const colCounts = puzzle.colCounts

  // 1. Validar conteos individuales y globales (track y overpass cuentan)
  const actualRowCounts = grid.map(row => row.filter(cell => cell === 'track' || cell === 'overpass').length)
  const actualColCounts = Array.from({ length: size }, (_, colIndex) =>
    grid.filter(row => row[colIndex] === 'track' || row[colIndex] === 'overpass').length
  )

  const rowStatus = actualRowCounts.map((count, index) => {
    if (count === rowCounts[index]) return 'correct'
    if (count > rowCounts[index]) return 'exceeded'
    return 'incomplete'
  })

  const colStatus = actualColCounts.map((count, index) => {
    if (count === colCounts[index]) return 'correct'
    if (count > colCounts[index]) return 'exceeded'
    return 'incomplete'
  })

  const countsMatch =
    rowStatus.every(status => status === 'correct') &&
    colStatus.every(status => status === 'correct')

  // 2. Comprobar ramificaciones y grados de nodos
  let noBranches = true
  let noDeadEnds = true

  const trackCells: Position[] = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 'track' || grid[r][c] === 'overpass') {
        trackCells.push({ row: r, col: c })
      }
    }
  }

  // Si no hay celdas colocadas, es incompleto
  if (trackCells.length === 0) {
    return {
      isValid: false,
      rowStatus,
      colStatus,
      rules: {
        countsMatch: false,
        singlePath: false,
        noLoops: true,
        noBranches: true,
        noDeadEnds: true,
      },
    }
  }

  // Construir mapa de vecinos activos usando 'connections'
  for (const cell of trackCells) {
    const isStart = cell.row === puzzle.start.row && cell.col === puzzle.start.col
    const isEnd = cell.row === puzzle.end.row && cell.col === puzzle.end.col
    const key = `${cell.row},${cell.col}`
    const count = connections[key]?.length || 0

    if (isStart || isEnd) {
      if (count > 1) noBranches = false
    } else {
      if (grid[cell.row][cell.col] === 'overpass') {
        if (count > 4) noBranches = false
        if (count < 4) noDeadEnds = false // Overpass necesita 4 para no ser dead end, pero el juego real no permite overpasses
      } else {
        if (count > 2) noBranches = false
        if (count < 2) noDeadEnds = false
      }
    }
  }

  // 3. Recorrer el camino de A a B para validar continuidad y no loops
  let singlePath = false
  let noLoops = true

  const visited = new Set<string>()
  const startKey = `${puzzle.start.row},${puzzle.start.col}`

  let currentKey = startKey
  let prevKey: string | null = null
  let pathLength = 0

  if (connections[startKey]) {
    visited.add(startKey)
    pathLength = 1

    while (currentKey) {
      const [rStr, cStr] = currentKey.split(',')
      const r = parseInt(rStr, 10)
      const c = parseInt(cStr, 10)
      const isEnd = r === puzzle.end.row && c === puzzle.end.col

      if (isEnd) {
        singlePath = true
        break
      }

      // Buscar siguiente vecino según el array de conexiones
      const neighbors = connections[currentKey] || []
      const nextCandidates = neighbors.filter(nKey => nKey !== prevKey)

      if (nextCandidates.length === 1) {
        prevKey = currentKey
        currentKey = nextCandidates[0]
        if (visited.has(currentKey)) {
          // Detectado bucle cerrado
          noLoops = false
          break
        }
        visited.add(currentKey)
        pathLength++
      } else {
        // bifurcación o vía muerta
        break
      }
    }
  }

  // Comprobar si hay celdas con vías que no fueron visitadas en el camino
  if (visited.size < trackCells.length) {
    // Hay bucles huérfanos o caminos desconectados
    noLoops = false
  }

  const isValid = countsMatch && singlePath && noLoops && noBranches && noDeadEnds

  return {
    isValid,
    rowStatus,
    colStatus,
    rules: {
      countsMatch,
      singlePath,
      noLoops,
      noBranches,
      noDeadEnds,
    },
  }
}
