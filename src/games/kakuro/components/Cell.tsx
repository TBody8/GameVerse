import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { KakuroCell } from '../logic/types'
import { playTick } from '@/utils/audio'

interface CellProps {
  cell: KakuroCell
  size: number
  isSelected: boolean
  isHinted: boolean
  isInvalid: boolean
  isCompleted?: boolean
  isCompletedRight?: boolean
  isCompletedDown?: boolean
  isInvalidRight?: boolean
  isInvalidDown?: boolean
  onClick: () => void
}

export default function Cell({ 
  cell, 
  size, 
  isSelected, 
  isHinted, 
  isInvalid,
  isCompleted,
  isCompletedRight, 
  isCompletedDown,
  isInvalidRight,
  isInvalidDown,
  onClick 
}: CellProps) {
  const gRef = useRef<SVGGElement>(null)
  
  const x = cell.col * size
  const y = cell.row * size

  useEffect(() => {
    if (isHinted && gRef.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        gRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1.1, duration: 0.3, ease: 'power2.out' }
      )
      .to(gRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1.2, 0.5)'
      })
    }
  }, [isHinted])

  if (cell.type === 'empty') {
    return null
  }

  if (cell.type === 'clue') {
    const rightColor = isCompletedRight ? '#34D399' : isInvalidRight ? '#EF4444' : '#FFFFFF'
    const downColor = isCompletedDown ? '#34D399' : isInvalidDown ? '#EF4444' : '#FFFFFF'
    
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect
          width={size}
          height={size}
          fill="rgba(225, 200, 150, 0.03)"
          stroke="var(--color-border-subtle)"
          strokeWidth={1}
        />
        <line
          x1={0}
          y1={0}
          x2={size}
          y2={size}
          stroke="var(--color-border-subtle)"
          strokeWidth={1}
        />
        {cell.clue?.right !== undefined && (
          <text
            x={size - 4}
            y={size * 0.35}
            fontSize={Math.max(10, size * 0.28)}
            fill={rightColor}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            dominantBaseline="middle"
            style={{ transition: 'fill var(--transition-base)' }}
          >
            {cell.clue.right}
          </text>
        )}
        {cell.clue?.down !== undefined && (
          <text
            x={4}
            y={size * 0.8}
            fontSize={Math.max(10, size * 0.28)}
            fill={downColor}
            textAnchor="start"
            fontFamily="var(--font-mono)"
            dominantBaseline="middle"
            style={{ transition: 'fill var(--transition-base)' }}
          >
            {cell.clue.down}
          </text>
        )}
      </g>
    )
  }

  // Playable cell
  const handlePlayableClick = () => {
    if (gRef.current) {
      // Tactile bounce animation
      gsap.fromTo(
        gRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.25, ease: 'back.out(1.5)' }
      )
    }
    playTick()
    onClick()
  }

  // Determine elegant colors
  const fillColor = isSelected 
    ? 'rgba(245, 158, 11, 0.04)' // Very subtle amber fill
    : isInvalid 
      ? 'rgba(239, 68, 68, 0.05)' // Very subtle red fill
      : isCompleted 
        ? 'rgba(16, 185, 129, 0.02)' // Microscopic green fill
        : 'rgba(225, 200, 150, 0.01)' // Default almost transparent papyrus

  const strokeColor = isSelected
    ? '#B45309' // Deep elegant copper/gold border
    : isInvalid
      ? 'var(--color-error)'
      : isCompleted
        ? 'rgba(16, 185, 129, 0.35)' // Subtle emerald border for completed blocks
        : 'var(--color-border-subtle)'

  return (
    <g
      ref={gRef}
      transform={`translate(${x}, ${y})`}
      onClick={handlePlayableClick}
      style={{ cursor: 'pointer', transformOrigin: `${size/2}px ${size/2}px` }}
    >
      <rect
        width={size}
        height={size}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isSelected ? 1.5 : 1}
        style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      {cell.value !== undefined && (
        <text
          x={size / 2}
          y={size / 2 + size * 0.15}
          fontSize={size * 0.6}
          fill={isInvalid ? 'var(--color-error)' : isCompleted ? '#34D399' : 'var(--color-text-primary)'}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono)"
          fontWeight={600}
          style={{ transition: 'fill 0.3s ease' }}
        >
          {cell.value}
        </text>
      )}
    </g>
  )
}
