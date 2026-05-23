import { KakuroPuzzle, KakuroCell, ValidationResult, Position } from './types'

export function validatePuzzle(grid: KakuroCell[][], puzzle: KakuroPuzzle): ValidationResult {
  const size = puzzle.gridSize
  const invalidCells: Position[] = []
  const completedHorizontal: Position[] = []
  const completedVertical: Position[] = []
  const completedCells: Position[] = []
  const invalidHorizontal: Position[] = []
  const invalidVertical: Position[] = []
  
  let allFilled = true

  // Verificamos bloques a partir de las pistas
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c]
      
      if (cell.type === 'clue' && cell.clue) {
        
        // Validar bloque derecho (horizontal)
        if (cell.clue.right !== undefined) {
          let currC = c + 1
          let sum = 0
          const blockCells: Position[] = []
          const numbers = new Set<number>()
          let hasDuplicate = false
          let hasEmpty = false

          while (currC < size && grid[r][currC].type === 'playable') {
            const val = grid[r][currC].value
            blockCells.push({ row: r, col: currC })
            if (val) {
              sum += val
              if (numbers.has(val)) hasDuplicate = true
              numbers.add(val)
            } else {
              hasEmpty = true
            }
            currC++
          }

          if (hasDuplicate) {
            invalidCells.push(...blockCells)
            invalidHorizontal.push({ row: r, col: c })
          } else if (!hasEmpty) {
            if (sum !== cell.clue.right) {
              invalidCells.push(...blockCells)
              invalidHorizontal.push({ row: r, col: c })
            } else {
              completedHorizontal.push({ row: r, col: c })
              completedCells.push(...blockCells)
            }
          }
        }

        // Validar bloque abajo (vertical)
        if (cell.clue.down !== undefined) {
          let currR = r + 1
          let sum = 0
          const blockCells: Position[] = []
          const numbers = new Set<number>()
          let hasDuplicate = false
          let hasEmpty = false

          while (currR < size && grid[currR][c].type === 'playable') {
            const val = grid[currR][c].value
            blockCells.push({ row: currR, col: c })
            if (val) {
              sum += val
              if (numbers.has(val)) hasDuplicate = true
              numbers.add(val)
            } else {
              hasEmpty = true
            }
            currR++
          }

          if (hasDuplicate) {
            invalidCells.push(...blockCells)
            invalidVertical.push({ row: r, col: c })
          } else if (!hasEmpty) {
            if (sum !== cell.clue.down) {
              invalidCells.push(...blockCells)
              invalidVertical.push({ row: r, col: c })
            } else {
              completedVertical.push({ row: r, col: c })
              completedCells.push(...blockCells)
            }
          }
        }
      } else if (cell.type === 'playable' && !cell.value) {
        allFilled = false
      }
    }
  }

  // Quitar duplicados de invalidCells
  const uniqueInvalidCells = invalidCells.filter((v, i, a) => 
    a.findIndex(t => t.row === v.row && t.col === v.col) === i
  )

  const isValid = allFilled && uniqueInvalidCells.length === 0

  return {
    isValid,
    invalidCells: uniqueInvalidCells,
    completedBlocks: {
      horizontal: completedHorizontal,
      vertical: completedVertical,
      cells: completedCells
    },
    invalidBlocks: {
      horizontal: invalidHorizontal,
      vertical: invalidVertical
    }
  }
}
