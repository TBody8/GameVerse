interface ColIndicatorProps {
  col: number
  count: number
  actualCount: number
  status: 'correct' | 'exceeded' | 'incomplete'
}

export default function ColIndicator({ col, count, status }: Omit<ColIndicatorProps, 'actualCount'>) {
  // Posición arriba de la cuadrícula
  const x = col * 100 + 44
  const y = -24

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
