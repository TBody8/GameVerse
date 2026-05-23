export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type CellType = 'empty' | 'clue' | 'playable'

export interface Position {
  row: number
  col: number
}

export interface ClueData {
  right?: number
  down?: number
}

export interface KakuroCell {
  id: string
  row: number
  col: number
  type: CellType
  clue?: ClueData
  value?: number // For playable cells
}

export interface KakuroPuzzle {
  id: string
  gridSize: number
  grid: KakuroCell[][]
  solution: number[][] // Same size grid, 0 for non-playable, 1-9 for playable
}

export interface ValidationResult {
  isValid: boolean
  invalidCells: Position[]
  completedBlocks: {
    horizontal: Position[]
    vertical: Position[]
    cells: Position[] // Playable cells that belong to ANY completed block
  }
  invalidBlocks: {
    horizontal: Position[]
    vertical: Position[]
  }
}
