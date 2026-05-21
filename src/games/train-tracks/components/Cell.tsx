import { type CellState, type Position } from '../logic/types'
import { getTrackPiece } from '../logic/orientation'
import Track from './Track'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { playTick, playBlock } from '@/utils/audio'

interface CellProps {
  row: number
  col: number
  state: CellState
  grid: CellState[][]
  start: Position & { dir: 'N' | 'S' | 'E' | 'W' }
  end: Position & { dir: 'N' | 'S' | 'E' | 'W' }
  isHinted?: boolean
  onClick: () => void
}

export default function Cell({ row, col, state, grid, start, end, isHinted, onClick }: CellProps) {
  const isStart = row === start.row && col === start.col
  const isEnd = row === end.row && col === end.col
  const isFixed = isStart || isEnd

  const cellRef = useRef<SVGGElement>(null)

  // Animación de Hint
  useEffect(() => {
    if (isHinted && cellRef.current) {
      // Fade in elegante + Palpitamiento suave de escala
      const tl = gsap.timeline()
      tl.fromTo(
        cellRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1.1, duration: 0.3, ease: 'power2.out' }
      )
      .to(cellRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1.2, 0.5)'
      })
    }
  }, [isHinted])

  const handleClick = () => {
    if (isFixed) return

    // Sonidos táctiles diferenciados
    if (state === 'empty') {
      playTick() // Poner vía
    } else if (state === 'track') {
      playBlock() // Poner cruz (bloqueo)
    } else {
      playTick() // Volver a vacío
    }

    if (cellRef.current) {
      gsap.fromTo(
        cellRef.current,
        { scale: 0.90 },
        { scale: 1, duration: 0.15, ease: 'back.out(1.8)' }
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
      {/* Fondo de la celda de la rejilla arcade */}
      <rect
        x={col * 100}
        y={row * 100}
        width={100}
        height={100}
        fill="#090E0C"
        stroke="var(--color-border-subtle)"
        strokeWidth={1}
      />

      {/* Resplandor de fondo si tiene vía activa */}
      {state === 'track' && (
        <rect
          x={col * 100 + 6}
          y={row * 100 + 6}
          width={88}
          height={88}
          fill="var(--color-accent-subtle)"
          opacity={0.08}
          rx={4}
        />
      )}

      {/* Renderizar pistas/estaciones fijas A y B */}
      {isFixed && (
        <rect
          x={col * 100 + 4}
          y={row * 100 + 4}
          width={92}
          height={92}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-border)"
          strokeWidth={1}
          opacity={0.35}
          rx={6}
        />
      )}

      {/* Si tiene vía colocada */}
      {state === 'track' && (
        <g transform={`translate(${col * 100}, ${row * 100})`}>
          <Track type={trackPieceType} />
        </g>
      )}

      {/* Si está bloqueada con Cruz (X) de Neón Ámbar sutil */}
      {state === 'blocked' && (
        <g transform={`translate(${col * 100}, ${row * 100})`}>
          <line
            x1={42}
            y1={42}
            x2={58}
            y2={58}
            stroke="var(--color-error)"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 3px var(--color-error))' }}
          />
          <line
            x1={58}
            y1={42}
            x2={42}
            y2={58}
            stroke="var(--color-error)"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 3px var(--color-error))' }}
          />
        </g>
      )}

      {/* Etiquetas de Estaciones de neón */}
      {isStart && (
        <text
          x={col * 100 + 15}
          y={row * 100 + 30}
          fill="var(--color-accent-text)"
          fontSize={16}
          fontWeight="bold"
          fontFamily="var(--font-mono)"
          style={{ filter: 'drop-shadow(0 0 4px var(--color-accent))' }}
        >
          A
        </text>
      )}

      {isEnd && (
        <text
          x={col * 100 + 15}
          y={row * 100 + 30}
          fill="var(--color-accent-text)"
          fontSize={16}
          fontWeight="bold"
          fontFamily="var(--font-mono)"
          style={{ filter: 'drop-shadow(0 0 4px var(--color-accent))' }}
        >
          B
        </text>
      )}
    </g>
  )
}
