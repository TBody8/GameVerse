import { describe, it, expect } from 'vitest'
import { validateBridges } from './validator'
import { Puzzle, Bridge } from './types'

describe('Bridges Validator', () => {
  it('validates a correct solution', () => {
    const puzzle: Puzzle = {
      id: 'test',
      gridSize: 5,
      islands: [
        { id: 'i1', pos: { row: 1, col: 1 }, requiredBridges: 1 },
        { id: 'i2', pos: { row: 1, col: 3 }, requiredBridges: 1 },
      ],
      solution: []
    }
    
    const bridges: Bridge[] = [
      { id: 'i1_i2', from: 'i1', to: 'i2', count: 1, isVertical: false }
    ]

    const result = validateBridges(puzzle, bridges)
    expect(result.isVictory).toBe(true)
    expect(result.islandStatus['i1']).toBe('exact')
  })
})
