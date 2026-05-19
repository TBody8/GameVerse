interface RowIndicatorProps {
  row: number
  count: number
  actualCount: number
  gridSize: number
  status: 'correct' | 'exceeded' | 'incomplete'
}

export default function RowIndicator({ row, count, gridSize, status }: Omit<RowIndicatorProps, 'actualCount'>) {
  // Posición a la derecha de la cuadrícula
  const x = gridSize * 100 + 24
  const y = row * 100 + 55

  let color = 'var(--color-text-primary)'
  if (status === 'correct') color = 'var(--color-success)'
  if (status === 'exceeded') color = 'var(--color-error)'

  return (
    <g>
      {/* Círculo de fondo sutil si es correcto */}
      {status === 'correct' && (
        <circle cx={x + 6} cy={y - 5} r={18} fill="var(--color-success-subtle)" opacity={0.5} />
      )}
      <text
        x={x}
        y={y}
        fill={color}
        fontSize={20}
        fontWeight="bold"
        fontFamily="var(--font-mono)"
        className={`font-mono ${status === 'correct' ? 'nixie-flicker-active' : ''}`}
      >
        {count}
      </text>
    </g>
  )
}
