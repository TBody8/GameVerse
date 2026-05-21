import { type Puzzle, type Position } from './types'

function shuffle<T>(array: readonly T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

const DIRS = [
  { r: -1, c: 0, dir: 'N' },
  { r: 1, c: 0, dir: 'S' },
  { r: 0, c: 1, dir: 'E' },
  { r: 0, c: -1, dir: 'W' },
] as const

type Dir = 'N' | 'S' | 'E' | 'W'

function getEdgeCells(size: number): { r: number; c: number; edge: Dir }[] {
  const edges: { r: number; c: number; edge: Dir }[] = []
  for (let i = 0; i < size; i++) {
    edges.push({ r: 0, c: i, edge: 'N' }) // Top edge
    edges.push({ r: size - 1, c: i, edge: 'S' }) // Bottom edge
    edges.push({ r: i, c: 0, edge: 'W' }) // Left edge
    edges.push({ r: i, c: size - 1, edge: 'E' }) // Right edge
  }
  return edges
}

export function generatePuzzle(size: number, minLength: number): Puzzle {
  let bestPuzzle: Puzzle | null = null
  
  // Try up to 100 times to get a good puzzle
  for (let attempt = 0; attempt < 100; attempt++) {
    const edges = shuffle(getEdgeCells(size))
    const startCell = edges[0]
    
    // We enter the grid FROM the outside edge.
    // So if startCell is on the North edge (r=0), we are coming from the North (dir='S' pointing inwards).
    const startDir = startCell.edge === 'N' ? 'S' : startCell.edge === 'S' ? 'N' : startCell.edge === 'E' ? 'W' : 'E'
    
    const visited = Array.from({ length: size }, () => Array(size).fill(false))
    visited[startCell.r][startCell.c] = true
    
    const path: Position[] = [{ row: startCell.r, col: startCell.c }]
    let foundPath: Position[] | null = null
    let foundEndDir: Dir | null = null

    function dfs(r: number, c: number) {
      if (foundPath) return // Already found

      const physicalDist = Math.abs(r - startCell.r) + Math.abs(c - startCell.c)
      const minPhysicalDist = Math.floor(size / 2) + 1

      // Try to end if we are at an edge (and not the start cell)
      if (
        path.length >= minLength &&
        (r === 0 || r === size - 1 || c === 0 || c === size - 1) &&
        (r !== startCell.r || c !== startCell.c) &&
        physicalDist >= minPhysicalDist
      ) {
        // We can exit here.
        // What direction do we exit towards?
        const exitDir = r === 0 ? 'N' : r === size - 1 ? 'S' : c === 0 ? 'W' : 'E'
        foundPath = [...path]
        foundEndDir = exitDir
        return
      }

      const nextDirs = shuffle(DIRS)
      for (const d of nextDirs) {
        const nr = r + d.r
        const nc = c + d.c
        
        // Bounds check
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue
        
        // Unvisited check
        if (visited[nr][nc]) continue

        // Basic 2x2 check to make the track more "snake-like" and avoid clumping.
        // We ensure that moving to nr,nc doesn't create a 2x2 block of tracks.
        let is2x2 = false
        const neighbors = [
          [{r: -1, c: 0}, {r: 0, c: -1}, {r: -1, c: -1}],
          [{r: -1, c: 0}, {r: 0, c: 1}, {r: -1, c: 1}],
          [{r: 1, c: 0}, {r: 0, c: -1}, {r: 1, c: -1}],
          [{r: 1, c: 0}, {r: 0, c: 1}, {r: 1, c: 1}],
        ]
        
        for (const block of neighbors) {
          let count = 0
          for (const nb of block) {
            const checkR = nr + nb.r
            const checkC = nc + nb.c
            if (checkR >= 0 && checkR < size && checkC >= 0 && checkC < size && visited[checkR][checkC]) {
              count++
            }
          }
          if (count === 3) {
            is2x2 = true
            break
          }
        }
        
        if (is2x2) continue

        visited[nr][nc] = true
        path.push({ row: nr, col: nc })
        
        dfs(nr, nc)
        if (foundPath) return
        
        path.pop()
        visited[nr][nc] = false
      }
    }

    dfs(startCell.r, startCell.c)

    if (foundPath && foundEndDir) {
      const finalPath = foundPath as Position[]
      const rowCounts = Array(size).fill(0)
      const colCounts = Array(size).fill(0)
      for (const p of finalPath) {
        rowCounts[p.row]++
        colCounts[p.col]++
      }
      
      bestPuzzle = {
        id: `proc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        gridSize: size,
        start: { row: finalPath[0].row, col: finalPath[0].col, dir: startDir },
        end: { row: finalPath[finalPath.length - 1].row, col: finalPath[finalPath.length - 1].col, dir: foundEndDir },
        rowCounts,
        colCounts,
        solution: finalPath
      }
      break
    }
  }

  if (!bestPuzzle) {
    // Fallback if somehow generation fails (very rare)
    return generatePuzzle(size, Math.max(size, minLength - 2))
  }

  return bestPuzzle
}
