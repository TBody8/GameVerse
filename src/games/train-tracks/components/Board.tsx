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
  connections: Record<string, string[]>
  onCellClick: (row: number, col: number) => void
}

export default function Board({ grid, puzzle, validation, hintedCell, connections, onCellClick }: BoardProps) {
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
        maxWidth: `${size * 70 + 80}px`,
        margin: '0 auto',
        aspectRatio: `${width} / ${height}`,
        backgroundColor: '#070A08', // Negro matriz apagada
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
            {row.map((cell, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                state={cell}
                grid={grid}
                start={puzzle.start}
                end={puzzle.end}
                isHinted={hintedCell !== null && hintedCell.row === rowIndex && hintedCell.col === colIndex}
                connections={connections ? (connections[`${rowIndex},${colIndex}`] || []) : []}
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

        {/* Estela del Tren Victorioso animado estilo TRON */}
        <g id="victory-train" style={{ opacity: 0, pointerEvents: 'none' }}>
          {/* Pequeño destello de neón brillante */}
          <circle cx={0} cy={0} r={18} fill="var(--color-accent-hover)" opacity={0.6} style={{ filter: 'drop-shadow(0 0 10px var(--color-accent-hover))' }} />
          <circle cx={0} cy={0} r={8} fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  )
}
