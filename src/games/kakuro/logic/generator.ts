import { Board, Cell } from './types';
import { Difficulty } from '@/types/game';

export function generateBoard(difficulty: Difficulty): Board {
  const size = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const cells: Cell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({
      id: `${r}-${c}`,
      row: r,
      col: c,
      type: r === 0 || c === 0 ? 'clue' : 'playable',
      clue: r === 0 || c === 0 ? { right: 10, down: 10 } : undefined
    }))
  );

  return { rows: size, cols: size, cells };
}
