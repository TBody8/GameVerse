export { type Difficulty } from '@/types/game'

export type CellState = 'empty' | 'track' | 'overpass' | 'blocked'

export interface Position {
  row: number
  col: number
}


export interface Puzzle {
  id: string
  gridSize: number
  start: Position & { dir: 'N' | 'S' | 'E' | 'W' }
  end: Position & { dir: 'N' | 'S' | 'E' | 'W' }
  rowCounts: number[]
  colCounts: number[]
  // Representación del camino de solución para verificación o pistas
  solution: Position[]
}
