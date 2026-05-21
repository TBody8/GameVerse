import { Board } from './types';

export function validateBoard(board: Board): boolean {
  // Simplistic validation stub
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const cell = board.cells[r][c];
      if (cell.type === 'playable' && !cell.value) {
        return false;
      }
    }
  }
  return true;
}
