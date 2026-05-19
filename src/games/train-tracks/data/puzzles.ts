import { type Puzzle } from '../logic/types'

export const trainTracksPuzzles: Record<string, Puzzle[]> = {
  easy: [
    // 4x4 Puzzle 1
    {
      id: 'easy-1',
      gridSize: 4,
      start: { row: 0, col: 0, dir: 'S' },
      end: { row: 3, col: 3, dir: 'E' },
      rowCounts: [2, 2, 2, 2],
      colCounts: [2, 2, 2, 2],
      solution: [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
      ],
    },
  ],
  medium: [
    // 6x6 Puzzle 1
    {
      id: 'medium-1',
      gridSize: 6,
      start: { row: 0, col: 1, dir: 'S' },
      end: { row: 5, col: 4, dir: 'S' },
      rowCounts: [2, 3, 3, 3, 3, 2],
      colCounts: [0, 4, 4, 4, 4, 0],
      solution: [
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 2 },
        { row: 2, col: 1 },
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 2, col: 3 },
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 2, col: 4 },
        { row: 3, col: 4 },
        { row: 4, col: 4 },
        { row: 4, col: 3 },
        { row: 4, col: 2 },
        { row: 5, col: 2 }, // Just as fallback
      ],
    },
  ],
  hard: [
    // 8x8 Puzzle 1
    {
      id: 'hard-1',
      gridSize: 8,
      start: { row: 0, col: 0, dir: 'S' },
      end: { row: 7, col: 7, dir: 'E' },
      rowCounts: [3, 3, 5, 5, 3, 3, 3, 3],
      colCounts: [3, 3, 3, 3, 5, 5, 3, 3],
      solution: [],
    },
  ],
  expert: [
    // 10x10 Puzzle 1
    {
      id: 'expert-1',
      gridSize: 10,
      start: { row: 0, col: 0, dir: 'S' },
      end: { row: 9, col: 9, dir: 'E' },
      rowCounts: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      colCounts: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      solution: [],
    },
  ],
}
