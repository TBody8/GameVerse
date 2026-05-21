import { type CellState } from '../logic/types'
import ShipPiece from './ShipPiece'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { playTick, playBlock } from '@/utils/audio'

interface CellProps {
  row: number
  col: number
  state: CellState
  grid: CellState[][]
  isFixed: boolean
  isHinted?: boolean
  isInvalid?: boolean
  onClick: () => void
}

export default function Cell({ row, col, state, grid, isFixed, isHinted, isInvalid, onClick }: CellProps) {
  const cellRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (isHinted && cellRef.current) {
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

    if (state === 'empty') {
      playBlock() // Agua
    } else if (state === 'water') {
      playTick() // Barco
    } else {
      playTick() // Vacío
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

  return (
    <g
      ref={cellRef}
      onClick={handleClick}
      style={{ cursor: isFixed ? 'default' : 'pointer', transformOrigin: `${col * 100 + 50}px ${row * 100 + 50}px` }}
    >
      <rect
        x={col * 100}
        y={row * 100}
        width={100}
        height={100}
        fill="var(--color-surface-2)"
        stroke="var(--color-border-subtle)"
        strokeWidth={1}
      />

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

      {state === 'water' && (
        <g transform={`translate(${col * 100}, ${row * 100})`} opacity={0.4}>
          {/* Marca de descarte táctico (X pequeña o cruz de radar) */}
          <line x1={40} y1={40} x2={60} y2={60} stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />
          <line x1={60} y1={40} x2={40} y2={60} stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />
          <circle cx={50} cy={50} r={2} fill="var(--color-accent)" />
        </g>
      )}

      {state === 'ship' && (
        <g transform={`translate(${col * 100}, ${row * 100})`}>
          <ShipPiece row={row} col={col} grid={grid} isInvalid={isInvalid} />
        </g>
      )}
    </g>
  )
}
