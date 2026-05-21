import { describe, it, expect } from 'vitest'
import { generateBridgesPuzzle } from './generator'
import { validateBridges } from './validator'

describe('Bridges Generator - Validación Exhaustiva', () => {
  it('generates puzzles for all difficulties with correct grid sizes', () => {
    const easy = generateBridgesPuzzle('easy')
    expect(easy.gridSize).toBe(5)
    expect(easy.islands.length).toBeGreaterThanOrEqual(4)
    expect(easy.solution.length).toBeGreaterThanOrEqual(3)

    const medium = generateBridgesPuzzle('medium')
    expect(medium.gridSize).toBe(7)
    expect(medium.islands.length).toBeGreaterThanOrEqual(6)

    const hard = generateBridgesPuzzle('hard')
    expect(hard.gridSize).toBe(10)
    expect(hard.islands.length).toBeGreaterThanOrEqual(10)

    const expert = generateBridgesPuzzle('expert')
    expect(expert.gridSize).toBe(13)
    expect(expert.islands.length).toBeGreaterThanOrEqual(15)
  })

  it('never assigns more bridges than physically possible (max 8 per island)', () => {
    for (let i = 0; i < 50; i++) {
      const p = generateBridgesPuzzle('hard')
      
      for (const isl of p.islands) {
        expect(isl.requiredBridges).toBeLessThanOrEqual(8)
        expect(isl.requiredBridges).toBeGreaterThan(0)
      }
    }
  })

  it('creates fully connected puzzles (all islands reachable)', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateBridgesPuzzle('medium')
      
      const adj: Record<string, string[]> = {}
      for (const isl of p.islands) adj[isl.id] = []
      for (const b of p.solution) {
        adj[b.from].push(b.to)
        adj[b.to].push(b.from)
      }

      const visited = new Set<string>()
      const queue = [p.islands[0].id]
      visited.add(p.islands[0].id)
      while (queue.length > 0) {
        const curr = queue.shift()!
        for (const neighbor of adj[curr]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor)
            queue.push(neighbor)
          }
        }
      }
      
      expect(visited.size).toBe(p.islands.length)
    }
  })

  it('solution bridges match island requirements exactly', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateBridgesPuzzle('hard')
      
      // Recalculate from solution
      const counts: Record<string, number> = {}
      for (const b of p.solution) {
        counts[b.from] = (counts[b.from] || 0) + b.count
        counts[b.to] = (counts[b.to] || 0) + b.count
      }

      for (const isl of p.islands) {
        expect(isl.requiredBridges).toBe(counts[isl.id] || 0)
      }
    }
  })

  it('total bridge count is even (each bridge connects 2 islands)', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateBridgesPuzzle('expert')
      const total = p.islands.reduce((sum, isl) => sum + isl.requiredBridges, 0)
      expect(total % 2).toBe(0)
    }
  })

  it('no solution bridges cross each other', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateBridgesPuzzle('hard')
      
      for (let a = 0; a < p.solution.length; a++) {
        for (let b = a + 1; b < p.solution.length; b++) {
          const b1 = p.solution[a]
          const b2 = p.solution[b]
          
          // Only check if one is vertical and one is horizontal
          if (b1.isVertical !== b2.isVertical) {
            const v = b1.isVertical ? b1 : b2
            const h = b1.isVertical ? b2 : b1
            
            const vFrom = p.islands.find(x => x.id === v.from)!
            const vTo = p.islands.find(x => x.id === v.to)!
            const hFrom = p.islands.find(x => x.id === h.from)!
            const hTo = p.islands.find(x => x.id === h.to)!
            
            const minRowV = Math.min(vFrom.pos.row, vTo.pos.row)
            const maxRowV = Math.max(vFrom.pos.row, vTo.pos.row)
            const vCol = vFrom.pos.col

            const minColH = Math.min(hFrom.pos.col, hTo.pos.col)
            const maxColH = Math.max(hFrom.pos.col, hTo.pos.col)
            const hRow = hFrom.pos.row

            // True crossing (not at endpoints)
            const crosses = vCol > minColH && vCol < maxColH && hRow > minRowV && hRow < maxRowV
            expect(crosses).toBe(false)
          }
        }
      }
    }
  })

  it('validator correctly identifies victory when solution is applied', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateBridgesPuzzle('medium')
      
      // Apply the solution as player bridges
      const result = validateBridges(p, p.solution)
      expect(result.isVictory).toBe(true)
      expect(result.invalidBridges.length).toBe(0)
      
      for (const isl of p.islands) {
        expect(result.islandStatus[isl.id]).toBe('exact')
      }
    }
  })

  it('validator detects incomplete puzzles', () => {
    const p = generateBridgesPuzzle('easy')
    
    // Apply only half the solution
    const halfBridges = p.solution.slice(0, Math.floor(p.solution.length / 2))
    const result = validateBridges(p, halfBridges)
    
    expect(result.isVictory).toBe(false)
  })

  it('validator detects exceeded islands', () => {
    const p = generateBridgesPuzzle('easy')
    
    // Add extra bridges to exceed an island
    const extraBridges = [...p.solution]
    const firstBridge = p.solution[0]
    extraBridges.push({
      ...firstBridge,
      id: firstBridge.id + '_extra',
      count: 1
    })
    
    const result = validateBridges(p, extraBridges)
    expect(result.isVictory).toBe(false)
  })
})
