import { describe, it, expect } from 'vitest';
import { validateBoard } from './validator';
import { Board } from './types';

describe('Kakuro Validator', () => {
  it('returns false if there are empty playable cells', () => {
    const board: Board = {
      rows: 1, cols: 1,
      cells: [[{ id: '0-0', row: 0, col: 0, type: 'playable' }]]
    };
    expect(validateBoard(board)).toBe(false);
  });
});
