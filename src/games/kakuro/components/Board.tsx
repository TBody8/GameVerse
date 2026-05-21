import { Board as BoardType } from '../logic/types';
import { playTick } from '@/utils/audio';

interface BoardProps {
  board: BoardType | null;
  onCellClick: (r: number, c: number) => void;
}

export function Board({ board, onCellClick }: BoardProps) {
  if (!board) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${board.cols}, 40px)` }}>
      {board.cells.flat().map(cell => (
        <div
          key={cell.id}
          style={{
            width: 40, height: 40,
            border: '1px solid var(--color-border)',
            background: cell.type === 'clue' ? '#333' : '#fff',
            color: cell.type === 'clue' ? '#fff' : 'var(--color-text-primary)'
          }}
          onClick={() => {
            if (cell.type === 'playable') {
              playTick();
              onCellClick(cell.row, cell.col);
            }
          }}
        >
          {cell.type === 'playable' ? cell.value : ''}
        </div>
      ))}
    </div>
  );
}
