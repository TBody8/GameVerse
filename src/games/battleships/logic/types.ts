export { type Difficulty } from '@/types/game'

export type CellState = 'empty' | 'water' | 'ship'

export interface Position {
  row: number
  col: number
}


export interface Fleet {
  [size: number]: number // e.g., { 1: 1, 2: 2, 3: 1 } means 1 sub(1), 2 destroyers(2), 1 cruiser(3)
}

export interface Puzzle {
  id: string
  gridSize: number
  fleet: Fleet
  rowCounts: number[]
  colCounts: number[]
  solution: CellState[][]
  // Algunas celdas iniciales reveladas para que el puzzle tenga un ancla lógica
  initialRevealed: { row: number, col: number, state: CellState }[]
}
