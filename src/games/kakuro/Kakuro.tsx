import { useKakuro } from './hooks/useKakuro';
import { Board } from './components/Board';
import { NumberPad } from './components/NumberPad';
import DifficultySelector from '@/components/game-shared/DifficultySelector';
import GameHeader from '@/components/game-shared/GameHeader';
import { useState } from 'react';
import { usePageTransition } from '@/components/layout/PageTransitionWrapper';

export default function Kakuro() {
  const { state, setCell, newGame } = useKakuro();
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
  const { navigateWithTransition } = usePageTransition();

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ r, c });
  };

  const handleNumberSelect = (num: number) => {
    if (selectedCell) {
      setCell(selectedCell.r, selectedCell.c, num);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <GameHeader 
        title="Kakuro" 
        difficulty={state.difficulty} 
        time={0}
        onReset={() => newGame(state.difficulty)} 
        onBack={() => navigateWithTransition('/')} 
      />
      <DifficultySelector
        current={state.difficulty}
        onChange={newGame}
        labels={{ easy: 'Fácil', medium: 'Medio', hard: 'Difícil', expert: 'Experto' }}
      />
      {state.isWon && <h2>¡Victoria!</h2>}
      <Board board={state.board} onCellClick={handleCellClick} />
      <NumberPad onSelect={handleNumberSelect} />
    </div>
  );
}