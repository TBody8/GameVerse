import { Difficulty } from '@/types/game'
import { Puzzle, Island, Bridge } from './types'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function tryGeneratePuzzle(size: number, maxIslands: number): Puzzle | null {
  const grid: (string | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null))
  
  const islands: Island[] = []
  const solutionBridges: Bridge[] = []
  let islandIdCounter = 1

  const addIsland = (r: number, c: number) => {
    const id = `i${islandIdCounter++}`
    const newIsland: Island = { id, pos: { row: r, col: c }, requiredBridges: 0 }
    islands.push(newIsland)
    grid[r][c] = 'I'
    return newIsland
  }

  // FIX: Escáner estricto de la trayectoria. Si hay una isla ('I') o un puente ('B'), aborta.
  const isPathClear = (r1: number, c1: number, r2: number, c2: number): boolean => {
    const minR = Math.min(r1, r2)
    const maxR = Math.max(r1, r2)
    const minC = Math.min(c1, c2)
    const maxC = Math.max(c1, c2)

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if ((r === r1 && c === c1) || (r === r2 && c === c2)) continue // Ignorar los propios extremos
        if (grid[r][c] !== null) return false // Choca contra CUALQUIER cosa (puente o isla)
      }
    }
    return true
  }

  // FIX: Marcar celdas como puente para que el generador "vea" la materia sólida
  const markBridgeInGrid = (r1: number, c1: number, r2: number, c2: number) => {
    const minR = Math.min(r1, r2)
    const maxR = Math.max(r1, r2)
    const minC = Math.min(c1, c2)
    const maxC = Math.max(c1, c2)

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if ((r === r1 && c === c1) || (r === r2 && c === c2)) continue
        grid[r][c] = 'B'
      }
    }
  }

  const bridgeExists = (id1: string, id2: string): boolean => {
    return solutionBridges.some(b => 
      (b.from === id1 && b.to === id2) || (b.from === id2 && b.to === id1)
    )
  }

  const countOrthogonalNeighbors = (isl: Island): number => {
    let count = 0
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (const [dr, dc] of dirs) {
      let r = isl.pos.row + dr
      let c = isl.pos.col + dc
      // El vecino solo es válido si el camino hasta él está despejado de PUENTES cruzados
      let valid = true
      while (r >= 0 && r < size && c >= 0 && c < size) {
        if (grid[r][c] === 'I') {
          if (valid) count++
          break
        } else if (grid[r][c] === 'B') {
          // Si nos cruzamos con un puente, esta línea de visión está bloqueada
          valid = false
        }
        r += dr
        c += dc
      }
    }
    return count
  }

  const tryAddBridge = (isl1: Island, isl2: Island, bCount: number): boolean => {
    if (bridgeExists(isl1.id, isl2.id)) return false
    
    const r1 = isl1.pos.row, c1 = isl1.pos.col
    const r2 = isl2.pos.row, c2 = isl2.pos.col
    
    if (r1 !== r2 && c1 !== c2) return false
    if (!isPathClear(r1, c1, r2, c2)) return false
    
    const maxForIsl1 = countOrthogonalNeighbors(isl1) * 2
    const maxForIsl2 = countOrthogonalNeighbors(isl2) * 2
    
    const currentForIsl1 = solutionBridges
      .filter(b => b.from === isl1.id || b.to === isl1.id)
      .reduce((sum, b) => sum + b.count, 0)
    const currentForIsl2 = solutionBridges
      .filter(b => b.from === isl2.id || b.to === isl2.id)
      .reduce((sum, b) => sum + b.count, 0)
    
    if (currentForIsl1 + bCount > maxForIsl1 || currentForIsl2 + bCount > maxForIsl2) return false
    
    solutionBridges.push({
      id: [isl1.id, isl2.id].sort().join('_'),
      from: isl1.id,
      to: isl2.id,
      count: bCount,
      isVertical: c1 === c2
    })
    markBridgeInGrid(r1, c1, r2, c2)
    return true
  }

  const startR = Math.floor(size / 2)
  const startC = Math.floor(size / 2)
  addIsland(startR, startC)

  let attempts = 0
  while (islands.length < maxIslands && attempts < 3000) {
    attempts++
    
    const fromIsland = islands[randInt(0, islands.length - 1)]
    const { row: r1, col: c1 } = fromIsland.pos

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    const [dr, dc] = dirs[randInt(0, 3)]
    
    const dist = randInt(2, Math.max(3, Math.floor(size / 2)))

    const r2 = r1 + (dr * dist)
    const c2 = c1 + (dc * dist)

    if (r2 < 0 || r2 >= size || c2 < 0 || c2 >= size) continue
    if (grid[r2][c2] !== null) continue
    if (!isPathClear(r1, c1, r2, c2)) continue

    const toIsland = addIsland(r2, c2)
    const bCount = randInt(1, 2)
    
    solutionBridges.push({
      id: [fromIsland.id, toIsland.id].sort().join('_'),
      from: fromIsland.id,
      to: toIsland.id,
      count: bCount,
      isVertical: dc === 0
    })
    markBridgeInGrid(r1, c1, r2, c2)
  }

  for (let i = 0; i < islands.length; i++) {
    for (let j = i + 1; j < islands.length; j++) {
      if (Math.random() > 0.3) continue
      tryAddBridge(islands[i], islands[j], randInt(1, 2))
    }
  }

  const counts: Record<string, number> = {}
  for (const b of solutionBridges) {
    counts[b.from] = (counts[b.from] || 0) + b.count
    counts[b.to] = (counts[b.to] || 0) + b.count
  }

  for (const isl of islands) {
    isl.requiredBridges = counts[isl.id] || 0
  }

  let allValid = true
  for (const isl of islands) {
    if (isl.requiredBridges > 8 || isl.requiredBridges === 0) {
      allValid = false
      break
    }
  }

  if (!allValid || islands.length < 4 || solutionBridges.length < 3) {
    return null
  }

  const adj: Record<string, string[]> = {}
  for (const isl of islands) adj[isl.id] = []
  for (const b of solutionBridges) {
    adj[b.from].push(b.to)
    adj[b.to].push(b.from)
  }

  const visited = new Set<string>()
  const queue = [islands[0].id]
  visited.add(islands[0].id)
  while (queue.length > 0) {
    const curr = queue.shift()!
    for (const neighbor of adj[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  if (visited.size !== islands.length) {
    return null
  }

  for (let a = 0; a < solutionBridges.length; a++) {
    for (let b = a + 1; b < solutionBridges.length; b++) {
      const b1 = solutionBridges[a]
      const b2 = solutionBridges[b]
      if (b1.isVertical !== b2.isVertical) {
        const v = b1.isVertical ? b1 : b2
        const h = b1.isVertical ? b2 : b1
        const vFrom = islands.find(x => x.id === v.from)!
        const vTo = islands.find(x => x.id === v.to)!
        const hFrom = islands.find(x => x.id === h.from)!
        const hTo = islands.find(x => x.id === h.to)!
        
        const minRowV = Math.min(vFrom.pos.row, vTo.pos.row)
        const maxRowV = Math.max(vFrom.pos.row, vTo.pos.row)
        const vCol = vFrom.pos.col
        const minColH = Math.min(hFrom.pos.col, hTo.pos.col)
        const maxColH = Math.max(hFrom.pos.col, hTo.pos.col)
        const hRow = hFrom.pos.row

        if (vCol > minColH && vCol < maxColH && hRow > minRowV && hRow < maxRowV) {
          return null
        }
      }
    }
  }

  // --- MATEMÁTICAS DE CENTRADO EXACTO ---
  // Calculamos la caja delimitadora (bounding box) real de las islas generadas
  const minRow = Math.min(...islands.map(i => i.pos.row))
  const maxRow = Math.max(...islands.map(i => i.pos.row))
  const minCol = Math.min(...islands.map(i => i.pos.col))
  const maxCol = Math.max(...islands.map(i => i.pos.col))

  const puzzleWidth = maxCol - minCol
  const puzzleHeight = maxRow - minRow

  // Calculamos la diferencia desde los extremos hasta el tamaño total de la cuadricula
  const targetMinCol = Math.floor((size - 1 - puzzleWidth) / 2)
  const targetMinRow = Math.floor((size - 1 - puzzleHeight) / 2)

  const offsetCol = targetMinCol - minCol
  const offsetRow = targetMinRow - minRow

  // Si hay un desfase, trasladamos todas las coordenadas de las islas
  if (offsetCol !== 0 || offsetRow !== 0) {
    islands.forEach(isl => {
      isl.pos.col += offsetCol
      isl.pos.row += offsetRow
    })
  }

  return {
    id: `bridges-${Date.now()}`,
    gridSize: size,
    islands,
    solution: solutionBridges
  }
}

export function generateBridgesPuzzle(difficulty: Difficulty): Puzzle {
  const sizes: Record<Difficulty, number> = { easy: 5, medium: 7, hard: 10, expert: 13 }
  const targetIslands: Record<Difficulty, number> = { easy: 6, medium: 10, hard: 18, expert: 28 }
  
  const size = sizes[difficulty]
  const maxIslands = targetIslands[difficulty]

  const MAX_RETRIES = 50
  for (let i = 0; i < MAX_RETRIES; i++) {
    const result = tryGeneratePuzzle(size, maxIslands)
    if (result) return result
  }

  const fallback = tryGeneratePuzzle(size, Math.max(4, Math.floor(maxIslands * 0.6)))
  if (fallback) return fallback

  return {
    id: `bridges-${Date.now()}`,
    gridSize: size,
    islands: [],
    solution: []
  }
}
