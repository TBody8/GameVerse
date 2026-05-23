import { KakuroCell, Position, ValidationResult } from '../logic/types'
import Cell from './Cell'

interface BoardProps {
  grid: KakuroCell[][]
  gridSize: number
  validation: ValidationResult
  hintedCell: Position | null
  selectedCell: Position | null
  onCellClick: (row: number, col: number) => void
}

export function Board({ grid, gridSize, validation, hintedCell, selectedCell, onCellClick }: BoardProps) {
  // Calculamos tamanos de celda adaptativos
  const cellSize = gridSize <= 6 ? 60 : gridSize <= 8 ? 50 : 40
  const width = gridSize * cellSize
  const height = gridSize * cellSize

  return (
    <div
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        margin: '0 auto',
        aspectRatio: '1 / 1',
        backgroundColor: 'transparent',
        padding: 'var(--space-2)',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        {grid.map((row, r) => (
          <g key={`row-${r}`}>
            {row.map((cell, c) => {
              const isHinted = hintedCell !== null && hintedCell.row === r && hintedCell.col === c
              const isInvalid = validation.invalidCells ? validation.invalidCells.some((p: Position) => p.row === r && p.col === c) : false
              const isSelected = selectedCell !== null && selectedCell.row === r && selectedCell.col === c
              const isCompleted = validation.completedBlocks?.cells.some(p => p.row === r && p.col === c) ?? false
              
              const isCompletedRight = validation.completedBlocks?.horizontal.some(p => p.row === r && p.col === c) ?? false
              const isCompletedDown = validation.completedBlocks?.vertical.some(p => p.row === r && p.col === c) ?? false
              const isInvalidRight = validation.invalidBlocks?.horizontal.some(p => p.row === r && p.col === c) ?? false
              const isInvalidDown = validation.invalidBlocks?.vertical.some(p => p.row === r && p.col === c) ?? false

              return (
                <Cell
                  key={`cell-${r}-${c}`}
                  cell={cell}
                  size={cellSize}
                  isSelected={isSelected}
                  isHinted={isHinted}
                  isInvalid={isInvalid}
                  isCompleted={isCompleted}
                  isCompletedRight={isCompletedRight}
                  isCompletedDown={isCompletedDown}
                  isInvalidRight={isInvalidRight}
                  isInvalidDown={isInvalidDown}
                  onClick={() => onCellClick(r, c)}
                />
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}
