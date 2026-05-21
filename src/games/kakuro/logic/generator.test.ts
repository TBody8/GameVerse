import { describe, it, expect } from 'vitest';
import { generateBoard } from './generator';

describe('Kakuro Generator', () => {
  it('generates an easy board of size 4x4', () => {
    const board = generateBoard('easy');
    expect(board.rows).toBe(4);
    expect(board.cols).toBe(4);
    expect(board.cells.length).toBe(4);
  });
});
