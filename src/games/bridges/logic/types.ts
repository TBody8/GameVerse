export interface Position {
  row: number
  col: number
}

export interface Island {
  id: string
  pos: Position
  requiredBridges: number
}

export interface Bridge {
  id: string
  from: string // Island ID
  to: string   // Island ID
  count: number // 1 or 2
  isVertical: boolean
}

export interface Puzzle {
  id: string
  gridSize: number
  islands: Island[]
  solution: Bridge[]
}

export interface ValidationResult {
  isVictory: boolean
  islandStatus: Record<string, 'incomplete' | 'exact' | 'exceeded'>
  invalidBridges: string[] // IDs of bridges that cross
}
