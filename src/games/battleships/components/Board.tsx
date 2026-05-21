import { type CellState, type Puzzle, type Position } from '../logic/types'
import { type ValidationResult } from '../logic/validator'
import Cell from './Cell'
import RowIndicator from './RowIndicator'
import ColIndicator from './ColIndicator'

interface BoardProps {
  grid: CellState[][]
  puzzle: Puzzle
  validation: ValidationResult
  hintedCell: Position | null
  onCellClick: (row: number, col: number) => void
}

export default function Board({ grid, puzzle, validation, hintedCell, onCellClick }: BoardProps) {
  const size = puzzle.gridSize

  // Tamaño total de la cuadrícula SVG
  const width = size * 100 + 80
  const height = size * 100 + 120

  const colCounts = puzzle.colCounts
  const rowCounts = puzzle.rowCounts

  return (
    <div
      style={{
        width: '100%',
        maxWidth: `${size * 60 + 80}px`,
        margin: '0 auto',
        aspectRatio: `${width} / ${height}`,
        backgroundColor: '#050E14', // Fondo azul marino oscuro para el radar naval
        border: '2px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-4)',
        boxShadow: 'var(--shadow-neon-glow)',
      }}
    >
      <svg
        viewBox={`-20 -60 ${width} ${height}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        {/* Indicadores de Columnas (arriba) */}
        {colCounts.map((count, col) => {
          return (
            <ColIndicator
              key={`col-${col}`}
              col={col}
              count={count}
              status={validation.colStatus[col]}
            />
          )
        })}

        {/* Celdas del Tablero e Indicadores de Filas (derecha) */}
        {grid.map((row, rowIndex) => (
          <g key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => {
              const isFixed = puzzle.initialRevealed.some(p => p.row === rowIndex && p.col === colIndex)
              const isHinted = hintedCell !== null && hintedCell.row === rowIndex && hintedCell.col === colIndex
              return (
                <Cell
                  key={`cell-${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  state={cell}
                  grid={grid}
                  isFixed={isFixed}
                  isHinted={isHinted}
                  isInvalid={validation.invalidCells ? validation.invalidCells.some(p => p.row === rowIndex && p.col === colIndex) : false}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                />
              )
            })}

            <RowIndicator
              row={rowIndex}
              count={rowCounts[rowIndex]}
              gridSize={size}
              status={validation.rowStatus[rowIndex]}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
