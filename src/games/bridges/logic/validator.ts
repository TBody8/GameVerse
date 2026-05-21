import { Puzzle, Bridge, ValidationResult } from './types'

export function validateBridges(puzzle: Puzzle, currentBridges: Bridge[]): ValidationResult {
  const islandStatus: Record<string, 'incomplete' | 'exact' | 'exceeded'> = {}
  const invalidBridges: string[] = []

  // Count bridges per island
  const counts: Record<string, number> = {}
  for (const isl of puzzle.islands) {
    counts[isl.id] = 0
  }

  for (const b of currentBridges) {
    if (counts[b.from] !== undefined) counts[b.from] += b.count
    if (counts[b.to] !== undefined) counts[b.to] += b.count
  }

  let allExact = true
  for (const isl of puzzle.islands) {
    const total = counts[isl.id]
    if (total === isl.requiredBridges) {
      islandStatus[isl.id] = 'exact'
    } else if (total > isl.requiredBridges) {
      islandStatus[isl.id] = 'exceeded'
      allExact = false
    } else {
      islandStatus[isl.id] = 'incomplete'
      allExact = false
    }
  }

  // Check intersections (very basic bounding box check for orthogonal lines)
  for (let i = 0; i < currentBridges.length; i++) {
    for (let j = i + 1; j < currentBridges.length; j++) {
      const b1 = currentBridges[i]
      const b2 = currentBridges[j]
      if (b1.isVertical !== b2.isVertical) {
        const v = b1.isVertical ? b1 : b2
        const h = b1.isVertical ? b2 : b1
        const vFrom = puzzle.islands.find(x => x.id === v.from)!
        const vTo = puzzle.islands.find(x => x.id === v.to)!
        const hFrom = puzzle.islands.find(x => x.id === h.from)!
        const hTo = puzzle.islands.find(x => x.id === h.to)!
        
        const minRowV = Math.min(vFrom.pos.row, vTo.pos.row)
        const maxRowV = Math.max(vFrom.pos.row, vTo.pos.row)
        const vCol = vFrom.pos.col

        const minColH = Math.min(hFrom.pos.col, hTo.pos.col)
        const maxColH = Math.max(hFrom.pos.col, hTo.pos.col)
        const hRow = hFrom.pos.row

        // True crossing (not endpoints)
        if (vCol > minColH && vCol < maxColH && hRow > minRowV && hRow < maxRowV) {
          if (!invalidBridges.includes(b1.id)) invalidBridges.push(b1.id)
          if (!invalidBridges.includes(b2.id)) invalidBridges.push(b2.id)
          allExact = false
        }
      }
    }
  }

  // Check connectivity (BFS)
  let isConnected = false
  if (puzzle.islands.length > 0 && currentBridges.length > 0) {
    const visited = new Set<string>()
    const adj: Record<string, string[]> = {}
    for (const isl of puzzle.islands) adj[isl.id] = []
    for (const b of currentBridges) {
      adj[b.from].push(b.to)
      adj[b.to].push(b.from)
    }

    const queue = [puzzle.islands[0].id]
    visited.add(puzzle.islands[0].id)
    while (queue.length > 0) {
      const curr = queue.shift()!
      for (const neighbor of adj[curr]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }
    if (visited.size === puzzle.islands.length) {
      isConnected = true
    } else {
      allExact = false
    }
  } else {
    allExact = false
  }

  return {
    isVictory: allExact && isConnected && invalidBridges.length === 0,
    islandStatus,
    invalidBridges
  }
}
