import { type CellState, type Position } from './types'

// Determinar el tipo de pieza (recta, curva) para una celda dada en el tablero
export type TrackPieceType =
  | 'straight-h'
  | 'straight-v'
  | 'curve-ne'
  | 'curve-nw'
  | 'curve-se'
  | 'curve-sw'
  | 'overpass'
  | 'none'

export function getTrackPiece(
  row: number,
  col: number,
  grid: CellState[][],
  start: Position & { dir: 'N' | 'S' | 'E' | 'W' },
  end: Position & { dir: 'N' | 'S' | 'E' | 'W' },
  connections: string[] = []
): TrackPieceType {
  const cellState = grid[row][col]
  if (cellState !== 'track' && cellState !== 'overpass') return 'none'
  if (cellState === 'overpass') return 'overpass'

  // Usamos el array de conexiones explícitas para saber hacia dónde dibujar la vía
  const neighbors = {
    N: connections.includes(`${row - 1},${col}`),
    S: connections.includes(`${row + 1},${col}`),
    E: connections.includes(`${row},${col + 1}`),
    W: connections.includes(`${row},${col - 1}`)
  }

  // Estaciones A (start) y B (end) tienen una conexión "ficticia" hacia afuera de la cuadrícula
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

  // Si tiene 3 o más conexiones (que por el nuevo sistema inteligente no debería pasar en 'track', pero por si acaso)
  if (activeDirs.length >= 3) {
    return 'overpass'
  }

  // Si tiene exactamente 2 conexiones, calculamos la curva o línea recta
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
