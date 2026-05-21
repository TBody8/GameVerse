import { useReducer, useEffect } from 'react';
import { generateBoard } from '../logic/generator';
import { validateBoard } from '../logic/validator';
import { Board } from '../logic/types';
import { Difficulty } from '@/types/game';

interface GameState {
  board: Board | null;
  difficulty: Difficulty;
  isWon: boolean;
}

type Action = 
  | { type: 'NEW_GAME', payload: Difficulty }
  | { type: 'SET_CELL', payload: { r: number, c: number, value: number } };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return { board: generateBoard(action.payload), difficulty: action.payload, isWon: false };
    case 'SET_CELL': {
      if (!state.board) return state;
      const newCells = state.board.cells.map(row => row.map(cell => ({...cell})));
      newCells[action.payload.r][action.payload.c].value = action.payload.value;
      const newBoard = { ...state.board, cells: newCells };
      const isWon = validateBoard(newBoard);
      return { ...state, board: newBoard, isWon };
    }
    default:
      return state;
  }
}

export function useKakuro() {
  const [state, dispatch] = useReducer(gameReducer, {
    board: null,
    difficulty: 'easy',
    isWon: false
  });

  useEffect(() => {
    dispatch({ type: 'NEW_GAME', payload: 'easy' });
  }, []);

  const setCell = (r: number, c: number, value: number) => {
    dispatch({ type: 'SET_CELL', payload: { r, c, value } });
  };

  const newGame = (difficulty: Difficulty) => {
    dispatch({ type: 'NEW_GAME', payload: difficulty });
  };

  return { state, setCell, newGame };
}
