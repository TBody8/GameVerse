import { type Puzzle, type Fleet, type CellState, type Position } from './types'

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export function getFleetForDifficulty(difficulty: string): { size: number, fleet: Fleet, shipList: number[] } {
  if (difficulty === 'easy') return { size: 4, fleet: { 2: 1, 1: 2 }, shipList: [2, 1, 1] }
  if (difficulty === 'medium') return { size: 6, fleet: { 3: 1, 2: 1, 1: 2 }, shipList: [3, 2, 1, 1] }
  if (difficulty === 'hard') return { size: 8, fleet: { 4: 1, 3: 1, 2: 2, 1: 3 }, shipList: [4, 3, 2, 2, 1, 1, 1] }
  return { size: 10, fleet: { 4: 1, 3: 2, 2: 3, 1: 4 }, shipList: [4, 3, 3, 2, 2, 2, 1, 1, 1, 1] }
}

function canPlaceShip(grid: CellState[][], r: number, c: number, length: number, isVertical: boolean, size: number): boolean {
  // Check bounds
  if (isVertical && r + length > size) return false
  if (!isVertical && c + length > size) return false

  // Check collision with surrounding cells (including diagonals)
  for (let i = 0; i < length; i++) {
    const currR = isVertical ? r + i : r
    const currC = isVertical ? c : c + i

    // Check all 9 surrounding cells
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const checkR = currR + dr
        const checkC = currC + dc
        if (checkR >= 0 && checkR < size && checkC >= 0 && checkC < size) {
          if (grid[checkR][checkC] === 'ship') return false
        }
      }
    }
  }
  return true
}

export function generatePuzzle(difficulty: string): Puzzle {
  const { size, fleet, shipList } = getFleetForDifficulty(difficulty)
  let bestGrid: CellState[][] | null = null

  // Outer loop to prevent deep recursion/stack overflows
  for (let globalAttempt = 0; globalAttempt < 50; globalAttempt++) {
    // Try multiple times to fit all ships
    for (let attempt = 0; attempt < 500; attempt++) {
      const grid: CellState[][] = Array.from({ length: size }, () => Array(size).fill('water'))
      let success = true

      // Place largest ships first
      const shipsToPlace = [...shipList].sort((a, b) => b - a)

      for (const shipLen of shipsToPlace) {
        let placed = false
        // Try random positions up to 100 times for this ship
        for (let tries = 0; tries < 100; tries++) {
          const isVertical = Math.random() > 0.5
          const r = Math.floor(Math.random() * size)
          const c = Math.floor(Math.random() * size)

          if (canPlaceShip(grid, r, c, shipLen, isVertical, size)) {
            for (let i = 0; i < shipLen; i++) {
              grid[isVertical ? r + i : r][isVertical ? c : c + i] = 'ship'
            }
            placed = true
            break
          }
        }
        if (!placed) {
          success = false
          break
        }
      }

      if (success) {
        bestGrid = grid
        break
      }
    }
    
    if (bestGrid) break
  }

  if (!bestGrid) {
    // If it completely fails, return a safe minimal default to prevent crash
    bestGrid = Array.from({ length: size }, () => Array(size).fill('water'))
  }

  // Calculate row and col counts
  const rowCounts = Array(size).fill(0)
  const colCounts = Array(size).fill(0)
  const waterCells: Position[] = []
  const shipCells: Position[] = []

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (bestGrid[r][c] === 'ship') {
        rowCounts[r]++
        colCounts[c]++
        shipCells.push({ row: r, col: c })
      } else {
        waterCells.push({ row: r, col: c })
      }
    }
  }

  // Reveal a few initial cells to give the player an anchor
  // E.g. reveal 1 ship part and 2 water parts
  const initialRevealed: { row: number, col: number, state: CellState }[] = []
  
  if (shipCells.length > 0) {
    const randomShip = shipCells[Math.floor(Math.random() * shipCells.length)]
    initialRevealed.push({ row: randomShip.row, col: randomShip.col, state: 'ship' })
  }
  
  const numWaterRevealed = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 2
  const shuffledWater = shuffle(waterCells)
  for (let i = 0; i < Math.min(numWaterRevealed, shuffledWater.length); i++) {
    initialRevealed.push({ row: shuffledWater[i].row, col: shuffledWater[i].col, state: 'water' })
  }

  return {
    id: `bs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    gridSize: size,
    fleet,
    rowCounts,
    colCounts,
    solution: bestGrid,
    initialRevealed
  }
}
