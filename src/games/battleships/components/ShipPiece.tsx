import { type CellState } from '../logic/types'

interface ShipPieceProps {
  row: number
  col: number
  grid: CellState[][]
  isInvalid?: boolean
}

export default function ShipPiece({ row, col, grid, isInvalid }: ShipPieceProps) {
  const size = grid.length
  
  const hasTop = row > 0 && grid[row - 1][col] === 'ship'
  const hasBottom = row < size - 1 && grid[row + 1][col] === 'ship'
  const hasLeft = col > 0 && grid[row][col - 1] === 'ship'
  const hasRight = col < size - 1 && grid[row][col + 1] === 'ship'

  const hullFill = isInvalid ? "rgba(239, 68, 68, 0.2)" : "var(--color-accent-subtle)"
  const hullStroke = isInvalid ? "var(--color-error)" : "var(--color-accent)"
  const hullStrokeW = 3
  const filter = isInvalid ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))" : "drop-shadow(0 0 4px var(--color-accent))"
  
  // Ancho del barco
  const w = 60
  const m = (100 - w) / 2 // 20

  // 1. Submarino (1x1) - Diamante táctico
  if (!hasTop && !hasBottom && !hasLeft && !hasRight) {
    return (
      <g style={{ filter }}>
        {/* Casco diamante */}
        <polygon
          points="50,15 85,50 50,85 15,50"
          fill={hullFill}
          stroke={hullStroke}
          strokeWidth={hullStrokeW}
          strokeLinejoin="round"
        />
        {/* Detalles internos (torreta) */}
        <circle cx={50} cy={50} r={10} fill="none" stroke={hullStroke} strokeWidth={2} />
        <circle cx={50} cy={50} r={3} fill={hullStroke} />
      </g>
    )
  }

  // 2. Fragmento central (rectángulo con espina)
  if ((hasTop && hasBottom) || (hasLeft && hasRight)) {
    const isV = hasTop && hasBottom
    return (
      <g style={{ filter }}>
        <rect
          x={isV ? m : 0}
          y={isV ? 0 : m}
          width={isV ? w : 100}
          height={isV ? 100 : w}
          fill={hullFill}
          stroke={hullStroke}
          strokeWidth={hullStrokeW}
        />
        {/* Línea central (espina) */}
        <line
          x1={isV ? 50 : 0}
          y1={isV ? 0 : 50}
          x2={isV ? 50 : 100}
          y2={isV ? 100 : 50}
          stroke={hullStroke}
          strokeWidth={1}
          opacity={0.6}
          strokeDasharray="4 4"
        />
        {/* Torreta central */}
        <rect
          x={isV ? 35 : 40}
          y={isV ? 40 : 35}
          width={isV ? 30 : 20}
          height={isV ? 20 : 30}
          fill="none"
          stroke={hullStroke}
          strokeWidth={2}
        />
        <circle cx={50} cy={50} r={4} fill={hullStroke} />
      </g>
    )
  }

  // 3. Extremos (Proa / Popa con forma aerodinámica/bala)
  
  // Apunta hacia la Izquierda (tiene barco a la derecha)
  if (!hasLeft && hasRight) {
    return (
      <g style={{ filter }}>
        <path
          d={`M 100,${m} L 40,${m} L 15,50 L 40,${100 - m} L 100,${100 - m} Z`}
          fill={hullFill}
          stroke={hullStroke}
          strokeWidth={hullStrokeW}
          strokeLinejoin="round"
        />
        <line x1={30} y1={50} x2={100} y2={50} stroke={hullStroke} strokeWidth={1} opacity={0.6} strokeDasharray="4 4" />
        <circle cx={60} cy={50} r={8} fill="none" stroke={hullStroke} strokeWidth={2} />
      </g>
    )
  }
  
  // Apunta hacia la Derecha (tiene barco a la izquierda)
  if (hasLeft && !hasRight) {
    return (
      <g style={{ filter }}>
        <path
          d={`M 0,${m} L 60,${m} L 85,50 L 60,${100 - m} L 0,${100 - m} Z`}
          fill={hullFill}
          stroke={hullStroke}
          strokeWidth={hullStrokeW}
          strokeLinejoin="round"
        />
        <line x1={0} y1={50} x2={70} y2={50} stroke={hullStroke} strokeWidth={1} opacity={0.6} strokeDasharray="4 4" />
        <circle cx={40} cy={50} r={8} fill="none" stroke={hullStroke} strokeWidth={2} />
      </g>
    )
  }

  // Apunta hacia Arriba (tiene barco abajo)
  if (!hasTop && hasBottom) {
    return (
      <g style={{ filter }}>
        <path
          d={`M ${m},100 L ${m},40 L 50,15 L ${100 - m},40 L ${100 - m},100 Z`}
          fill={hullFill}
          stroke={hullStroke}
          strokeWidth={hullStrokeW}
          strokeLinejoin="round"
        />
        <line x1={50} y1={30} x2={50} y2={100} stroke={hullStroke} strokeWidth={1} opacity={0.6} strokeDasharray="4 4" />
        <circle cx={50} cy={60} r={8} fill="none" stroke={hullStroke} strokeWidth={2} />
      </g>
    )
  }

  // Apunta hacia Abajo (tiene barco arriba)
  if (hasTop && !hasBottom) {
    return (
      <g style={{ filter }}>
        <path
          d={`M ${m},0 L ${m},60 L 50,85 L ${100 - m},60 L ${100 - m},0 Z`}
          fill={hullFill}
          stroke={hullStroke}
          strokeWidth={hullStrokeW}
          strokeLinejoin="round"
        />
        <line x1={50} y1={0} x2={50} y2={70} stroke={hullStroke} strokeWidth={1} opacity={0.6} strokeDasharray="4 4" />
        <circle cx={50} cy={40} r={8} fill="none" stroke={hullStroke} strokeWidth={2} />
      </g>
    )
  }

  return null
}
