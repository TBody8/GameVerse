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

export function validatePuzzle(grid: CellState[][], puzzle: Puzzle): ValidationResult {
  const size = puzzle.gridSize
  const rowCounts = puzzle.rowCounts
  const colCounts = puzzle.colCounts

  // 1. Validar conteos individuales y globales
  const actualRowCounts = grid.map(row => row.filter(cell => cell === 'track').length)
  const actualColCounts = Array.from({ length: size }, (_, colIndex) =>
    grid.filter(row => row[colIndex] === 'track').length
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
      if (grid[r][c] === 'track') {
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

  // Construir mapa de vecinos activos
  const getNeighborsCount = (r: number, c: number): number => {
    let count = 0
    if (r > 0 && grid[r - 1][c] === 'track') count++
    if (r < size - 1 && grid[r + 1][c] === 'track') count++
    if (c > 0 && grid[r][c - 1] === 'track') count++
    if (c < size - 1 && grid[r][c + 1] === 'track') count++
    return count
  }

  for (const cell of trackCells) {
    const isStart = cell.row === puzzle.start.row && cell.col === puzzle.start.col
    const isEnd = cell.row === puzzle.end.row && cell.col === puzzle.end.col

    const count = getNeighborsCount(cell.row, cell.col)

    if (isStart || isEnd) {
      if (count > 1) noBranches = false
    } else {
      if (count > 2) noBranches = false
      if (count < 2) noDeadEnds = false
    }
  }

  // 3. Recorrer el camino de A a B para validar continuidad y no loops
  let singlePath = false
  let noLoops = true

  const visited = new Set<string>()
  const startKey = `${puzzle.start.row},${puzzle.start.col}`

  let current = grid[puzzle.start.row][puzzle.start.col] === 'track' ? puzzle.start : null
  let prev: Position | null = null
  let pathLength = 0

  if (current) {
    visited.add(startKey)
    pathLength = 1

    while (current) {
      const { row: r, col: c } = current
      const isEnd = r === puzzle.end.row && c === puzzle.end.col

      if (isEnd) {
        singlePath = true
        break
      }

      // Buscar siguiente vecino que sea vía y no sea el anterior
      const nextCandidates: Position[] = []
      const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
      ]

      for (const dir of directions) {
        const nr = r + dir.r
        const nc = c + dir.c
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (grid[nr][nc] === 'track' && (!prev || prev.row !== nr || prev.col !== nc)) {
            nextCandidates.push({ row: nr, col: nc })
          }
        }
      }

      if (nextCandidates.length === 1) {
        prev = current
        current = nextCandidates[0] as Position & { dir: "N" | "S" | "E" | "W" }
        const key = `${current.row},${current.col}`
        if (visited.has(key)) {
          // Detectado bucle cerrado
          noLoops = false
          break
        }
        visited.add(key)
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
