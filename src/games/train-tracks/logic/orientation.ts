import { type CellState, type Position } from './types'

// Determinar el tipo de pieza (recta, curva) para una celda dada en el tablero
export type TrackPieceType =
  | 'straight-h'
  | 'straight-v'
  | 'curve-ne'
  | 'curve-nw'
  | 'curve-se'
  | 'curve-sw'
  | 'none'

export function getTrackPiece(
  row: number,
  col: number,
  grid: CellState[][],
  start: Position & { dir: 'N' | 'S' | 'E' | 'W' },
  end: Position & { dir: 'N' | 'S' | 'E' | 'W' }
): TrackPieceType {
  if (grid[row][col] !== 'track') return 'none'

  // Encontrar celdas vecinas que también sean vías, o si son la entrada/salida
  const neighbors = {
    N: false,
    S: false,
    E: false,
    W: false,
  }

  // 1. Vecino Norte
  if (row > 0 && grid[row - 1][col] === 'track') neighbors.N = true
  // 2. Vecino Sur
  if (row < grid.length - 1 && grid[row + 1][col] === 'track') neighbors.S = true
  // 3. Vecino Este
  if (col < grid[0].length - 1 && grid[row][col + 1] === 'track') neighbors.E = true
  // 4. Vecino Oeste
  if (col > 0 && grid[row][col - 1] === 'track') neighbors.W = true

  // Estaciones A (start) y B (end)
  const isStart = row === start.row && col === start.col
  const isEnd = row === end.row && col === end.col

  if (isStart) {
    if (start.dir === 'S') neighbors.N = true
    if (start.dir === 'N') neighbors.S = true
    if (start.dir === 'E') neighbors.W = true
    if (start.dir === 'W') neighbors.E = true
  }

  if (isEnd) {
    if (end.dir === 'S') neighbors.S = true
    if (end.dir === 'N') neighbors.N = true
    if (end.dir === 'E') neighbors.E = true
    if (end.dir === 'W') neighbors.W = true
  }

  // Contar conexiones
  const activeDirs = Object.entries(neighbors)
    .filter(([_, active]) => active)
    .map(([dir]) => dir)

  // Si no tiene conexiones o solo una, decidimos basado en la entrada
  if (activeDirs.length === 0) {
    return 'straight-v'
  }

  if (activeDirs.length === 1) {
    const dir = activeDirs[0]
    if (dir === 'N' || dir === 'S') return 'straight-v'
    return 'straight-h'
  }

  // Si tiene exactamente 2 o más conexiones, calculamos la curva o línea recta
  const hasN = neighbors.N
  const hasS = neighbors.S
  const hasE = neighbors.E
  const hasW = neighbors.W

  if (hasN && hasS) return 'straight-v'
  if (hasE && hasW) return 'straight-h'

  if (hasN && hasE) return 'curve-ne'
  if (hasN && hasW) return 'curve-nw'
  if (hasS && hasE) return 'curve-se'
  if (hasS && hasW) return 'curve-sw'

  return 'straight-v'
}
