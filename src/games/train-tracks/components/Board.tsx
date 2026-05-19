import { type CellState, type Puzzle } from '../logic/types'
import { type ValidationResult } from '../logic/validator'
import Cell from './Cell'
import RowIndicator from './RowIndicator'
import ColIndicator from './ColIndicator'

interface BoardProps {
  grid: CellState[][]
  puzzle: Puzzle
  validation: ValidationResult
  onCellClick: (row: number, col: number) => void
}

export default function Board({ grid, puzzle, validation, onCellClick }: BoardProps) {
  const size = puzzle.gridSize

  // Tamaño total de la cuadrícula SVG
  // Celdas: 100 * size. Indicadores: 80 extra para derecha/arriba
  const width = size * 100 + 80
  const height = size * 100 + 40

  const colCounts = puzzle.colCounts
  const rowCounts = puzzle.rowCounts

  return (
    <div
      style={{
        width: '100%',
        maxWidth: `${size * 70 + 80}px`,
        margin: '0 auto',
        aspectRatio: `${width} / ${height}`,
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
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
            {row.map((cell, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                state={cell}
                grid={grid}
                start={puzzle.start}
                end={puzzle.end}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            ))}

            <RowIndicator
              row={rowIndex}
              count={rowCounts[rowIndex]}
              gridSize={size}
              status={validation.rowStatus[rowIndex]}
            />
          </g>
        ))}

        {/* Sprite del Tren Victorioso animado */}
        <g id="victory-train" style={{ opacity: 0, pointerEvents: 'none' }}>
          {/* Pequeña locomotora SVG minimalista */}
          <rect x={-15} y={-10} width={30} height={20} fill="var(--color-accent)" rx={4} />
          <rect x={-5} y={-14} width={12} height={8} fill="var(--color-accent-hover)" rx={2} />
          <circle cx={-8} cy={7} r={4} fill="#111" />
          <circle cx={8} cy={7} r={4} fill="#111" />
        </g>
      </svg>
    </div>
  )
}
