import { type Puzzle, type CellState } from './types'

export interface ValidationResult {
  isValid: boolean
  rowStatus: ('incomplete' | 'correct' | 'exceeded')[]
  colStatus: ('incomplete' | 'correct' | 'exceeded')[]
  fleetStatus: { [size: number]: { found: number, required: number } }
  hasDiagonalTouch?: boolean
  hasShapeError?: boolean
  invalidCells: { row: number, col: number }[]
}

export function validatePuzzle(grid: CellState[][], puzzle: Puzzle): ValidationResult {
  const size = puzzle.gridSize
  const rowStatus: ('incomplete' | 'correct' | 'exceeded')[] = Array(size).fill('incomplete')
  const colStatus: ('incomplete' | 'correct' | 'exceeded')[] = Array(size).fill('incomplete')

  let allLinesOk = true

  // Check rows
  for (let r = 0; r < size; r++) {
    let count = 0
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 'ship') count++
    }
    if (count > puzzle.rowCounts[r]) {
      rowStatus[r] = 'exceeded'
      allLinesOk = false
    } else if (count === puzzle.rowCounts[r]) {
      rowStatus[r] = 'correct'
    } else {
      rowStatus[r] = 'incomplete'
      allLinesOk = false
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    let count = 0
    for (let r = 0; r < size; r++) {
      if (grid[r][c] === 'ship') count++
    }
    if (count > puzzle.colCounts[c]) {
      colStatus[c] = 'exceeded'
      allLinesOk = false
    } else if (count === puzzle.colCounts[c]) {
      colStatus[c] = 'correct'
    } else {
      colStatus[c] = 'incomplete'
      allLinesOk = false
    }
  }

  // Find all ships on the grid (connected components)
  const visited = Array.from({ length: size }, () => Array(size).fill(false))
  const foundShips: { size: number, cells: {r: number, c: number}[] }[] = []
  let hasShapeError = false   // L-shaped / non-straight ship
  let hasDiagonalTouch = false // Two separate ships touching diagonally

  const invalidCellsSet = new Set<string>()
  const addInvalid = (r: number, c: number) => invalidCellsSet.add(`${r},${c}`)

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 'ship' && !visited[r][c]) {
        // BFS to find the whole ship
        let shipSize = 0
        const queue: {r: number, c: number}[] = [{r, c}]
        const currentShip: {r: number, c: number}[] = []
        visited[r][c] = true
        let minR = r, maxR = r, minC = c, maxC = c

        while (queue.length > 0) {
          const curr = queue.shift()!
          currentShip.push(curr)
          shipSize++
          minR = Math.min(minR, curr.r)
          maxR = Math.max(maxR, curr.r)
          minC = Math.min(minC, curr.c)
          maxC = Math.max(maxC, curr.c)

          // Check orthogonal neighbours (same ship)
          const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
          for (const d of dirs) {
            const nr = curr.r + d[0]
            const nc = curr.c + d[1]
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 'ship' && !visited[nr][nc]) {
              visited[nr][nc] = true
              queue.push({r: nr, c: nc})
            }
          }
        }

        // A valid ship is a straight line in exactly one axis
        const isStraight =
          ((maxR - minR + 1) === shipSize && (maxC - minC + 1) === 1) ||
          ((maxC - minC + 1) === shipSize && (maxR - minR + 1) === 1)

        if (!isStraight) {
          hasShapeError = true
          currentShip.forEach(pos => addInvalid(pos.r, pos.c))
        }

        foundShips.push({ size: shipSize, cells: currentShip })
      }
    }
  }

  // Check diagonal touching between DIFFERENT ships (after all ships are found)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== 'ship') continue
      const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      for (const d of diagDirs) {
        const nr = r + d[0]
        const nc = c + d[1]
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 'ship') {
          // Ships touching diagonally are always from different ships
          hasDiagonalTouch = true
          addInvalid(r, c)
          addInvalid(nr, nc)
        }
      }
    }
  }

  const fleetStatus: { [size: number]: { found: number, required: number } } = {}
  let fleetOk = true
  
  for (const sizeStr of Object.keys(puzzle.fleet)) {
    const s = parseInt(sizeStr)
    const required = puzzle.fleet[s]
    const matchingShips = foundShips.filter(x => x.size === s)
    const found = matchingShips.length
    fleetStatus[s] = { found, required }
    
    if (found > required) {
      fleetOk = false
      matchingShips.forEach(ship => ship.cells.forEach(pos => addInvalid(pos.r, pos.c)))
    } else if (found < required) {
      fleetOk = false
    }
  }

  // Also check if they placed ships that aren't in the fleet at all
  const extraShips = foundShips.filter(s => !puzzle.fleet[s.size])
  if (extraShips.length > 0) {
    fleetOk = false
    extraShips.forEach(ship => ship.cells.forEach(pos => addInvalid(pos.r, pos.c)))
  }

  const isValid = allLinesOk && fleetOk && !hasDiagonalTouch && !hasShapeError

  const invalidCells = Array.from(invalidCellsSet).map(str => {
    const [r, c] = str.split(',')
    return { row: parseInt(r, 10), col: parseInt(c, 10) }
  })

  return { isValid, rowStatus, colStatus, fleetStatus, hasDiagonalTouch, hasShapeError, invalidCells }
}
