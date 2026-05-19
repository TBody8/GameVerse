import { type CellState, type Position } from '../logic/types'
import { getTrackPiece } from '../logic/orientation'
import Track from './Track'
import { useRef } from 'react'
import { gsap } from 'gsap'

interface CellProps {
  row: number
  col: number
  state: CellState
  grid: CellState[][]
  start: Position & { dir: 'N' | 'S' | 'E' | 'W' }
  end: Position & { dir: 'N' | 'S' | 'E' | 'W' }
  onClick: () => void
}

export default function Cell({ row, col, state, grid, start, end, onClick }: CellProps) {
  const isStart = row === start.row && col === start.col
  const isEnd = row === end.row && col === end.col
  const isFixed = isStart || isEnd

  const cellRef = useRef<SVGGElement>(null)

  // Animación al hacer click / interactuar con la celda
  const handleClick = () => {
    if (isFixed) return

    if (cellRef.current) {
      gsap.fromTo(
        cellRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.15, ease: 'power2.out' }
      )
    }
    onClick()
  }

  const trackPieceType = getTrackPiece(row, col, grid, start, end)

  return (
    <g
      ref={cellRef}
      onClick={handleClick}
      style={{ cursor: isFixed ? 'default' : 'pointer', transformOrigin: `${col * 100 + 50}px ${row * 100 + 50}px` }}
    >
      {/* Fondo de la celda */}
      <rect
        x={col * 100}
        y={row * 100}
        width={100}
        height={100}
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth={1}
      />

      {/* Renderizar pistas/estaciones fijas A y B */}
      {isFixed && (
        <rect
          x={col * 100 + 4}
          y={row * 100 + 4}
          width={92}
          height={92}
          fill="var(--color-accent-subtle)"
          opacity={0.3}
          rx={4}
        />
      )}

      {/* Si tiene vía colocada */}
      {state === 'track' && (
        <g transform={`translate(${col * 100}, ${row * 100})`}>
          <Track type={trackPieceType} />
        </g>
      )}

      {/* Si está bloqueada con Cruz (X) */}
      {state === 'blocked' && (
        <g transform={`translate(${col * 100}, ${row * 100})`}>
          {/* Pequeña cruz sutil */}
          <line x1={40} y1={40} x2={60} y2={60} stroke="var(--color-text-secondary)" strokeWidth={3} strokeLinecap="round" />
          <line x1={60} y1={40} x2={40} y2={60} stroke="var(--color-text-secondary)" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}

      {/* Etiquetas de Estaciones */}
      {isStart && (
        <text
          x={col * 100 + 15}
          y={row * 100 + 25}
          fill="var(--color-accent)"
          fontSize={16}
          fontWeight="bold"
          fontFamily="var(--font-mono)"
        >
          A
        </text>
      )}

      {isEnd && (
        <text
          x={col * 100 + 15}
          y={row * 100 + 25}
          fill="var(--color-accent)"
          fontSize={16}
          fontWeight="bold"
          fontFamily="var(--font-mono)"
        >
          B
        </text>
      )}
    </g>
  )
}
