export type CellType = 'empty' | 'clue' | 'playable';

export interface Clue {
  right?: number;
  down?: number;
}

export interface Cell {
  id: string;
  row: number;
  col: number;
  type: CellType;
  clue?: Clue;
  value?: number;
}

export interface Board {
  rows: number;
  cols: number;
  cells: Cell[][];
}
