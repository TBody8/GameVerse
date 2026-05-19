import { type TrackPieceType } from '../logic/orientation'

interface TrackProps {
  type: TrackPieceType
}

export default function Track({ type }: TrackProps) {
  // Dimensiones de la celda en SVG: 100x100
  const strokeColor = 'var(--color-text-primary)'
  const railsWidth = 24
  const railsStroke = 'rgba(0, 0, 0, 0.15)'

  if (type === 'none') return null

  // Línea Recta Horizontal
  if (type === 'straight-h') {
    return (
      <g>
        {/* Balasto / Fondo de vía */}
        <line x1={0} y1={50} x2={100} y2={50} stroke={railsStroke} strokeWidth={railsWidth} />
        {/* Durmientes (pequeñas líneas transversales) */}
        <line x1={20} y1={38} x2={20} y2={62} stroke={strokeColor} strokeWidth={4} />
        <line x1={40} y1={38} x2={40} y2={62} stroke={strokeColor} strokeWidth={4} />
        <line x1={60} y1={38} x2={60} y2={62} stroke={strokeColor} strokeWidth={4} />
        <line x1={80} y1={38} x2={80} y2={62} stroke={strokeColor} strokeWidth={4} />
        {/* Rieles */}
        <line x1={0} y1={42} x2={100} y2={42} stroke={strokeColor} strokeWidth={2} />
        <line x1={0} y1={58} x2={100} y2={58} stroke={strokeColor} strokeWidth={2} />
      </g>
    )
  }

  // Línea Recta Vertical
  if (type === 'straight-v') {
    return (
      <g>
        {/* Balasto */}
        <line x1={50} y1={0} x2={50} y2={100} stroke={railsStroke} strokeWidth={railsWidth} />
        {/* Durmientes */}
        <line x1={38} y1={20} x2={62} y2={20} stroke={strokeColor} strokeWidth={4} />
        <line x1={38} y1={40} x2={62} y2={40} stroke={strokeColor} strokeWidth={4} />
        <line x1={38} y1={60} x2={62} y2={60} stroke={strokeColor} strokeWidth={4} />
        <line x1={38} y1={80} x2={62} y2={80} stroke={strokeColor} strokeWidth={4} />
        {/* Rieles */}
        <line x1={42} y1={0} x2={42} y2={100} stroke={strokeColor} strokeWidth={2} />
        <line x1={58} y1={0} x2={58} y2={100} stroke={strokeColor} strokeWidth={2} />
      </g>
    )
  }

  // Curvas de 90° usando arcos SVG
  // curve-ne: Conecta Norte (50, 0) con Este (100, 50)
  if (type === 'curve-ne') {
    return (
      <g>
        <path d="M 50 0 A 50 50 0 0 1 100 50" fill="none" stroke={railsStroke} strokeWidth={railsWidth} />
        {/* Durmientes aproximados en la curva */}
        <line x1={60} y1={12} x2={50} y2={20} stroke={strokeColor} strokeWidth={4} />
        <line x1={76} y1={24} x2={66} y2={34} stroke={strokeColor} strokeWidth={4} />
        <line x1={88} y1={40} x2={80} y2={50} stroke={strokeColor} strokeWidth={4} />
        {/* Rieles */}
        <path d="M 42 0 A 58 58 0 0 1 100 58" fill="none" stroke={strokeColor} strokeWidth={2} />
        <path d="M 58 0 A 42 42 0 0 1 100 42" fill="none" stroke={strokeColor} strokeWidth={2} />
      </g>
    )
  }

  // curve-nw: Conecta Norte (50, 0) con Oeste (0, 50)
  if (type === 'curve-nw') {
    return (
      <g>
        <path d="M 50 0 A 50 50 0 0 0 0 50" fill="none" stroke={railsStroke} strokeWidth={railsWidth} />
        <line x1={40} y1={12} x2={50} y2={20} stroke={strokeColor} strokeWidth={4} />
        <line x1={24} y1={24} x2={34} y2={34} stroke={strokeColor} strokeWidth={4} />
        <line x1={12} y1={40} x2={20} y2={50} stroke={strokeColor} strokeWidth={4} />
        {/* Rieles */}
        <path d="M 58 0 A 58 58 0 0 0 0 58" fill="none" stroke={strokeColor} strokeWidth={2} />
        <path d="M 42 0 A 42 42 0 0 0 0 42" fill="none" stroke={strokeColor} strokeWidth={2} />
      </g>
    )
  }

  // curve-se: Conecta Sur (50, 100) con Este (100, 50)
  if (type === 'curve-se') {
    return (
      <g>
        <path d="M 50 100 A 50 50 0 0 0 100 50" fill="none" stroke={railsStroke} strokeWidth={railsWidth} />
        <line x1={60} y1={88} x2={50} y2={80} stroke={strokeColor} strokeWidth={4} />
        <line x1={76} y1={76} x2={66} y2={66} stroke={strokeColor} strokeWidth={4} />
        <line x1={88} y1={60} x2={80} y2={50} stroke={strokeColor} strokeWidth={4} />
        {/* Rieles */}
        <path d="M 42 100 A 58 58 0 0 0 100 42" fill="none" stroke={strokeColor} strokeWidth={2} />
        <path d="M 58 100 A 42 42 0 0 0 100 58" fill="none" stroke={strokeColor} strokeWidth={2} />
      </g>
    )
  }

  // curve-sw: Conecta Sur (50, 100) con Oeste (0, 50)
  if (type === 'curve-sw') {
    return (
      <g>
        <path d="M 50 100 A 50 50 0 0 1 0 50" fill="none" stroke={railsStroke} strokeWidth={railsWidth} />
        <line x1={40} y1={88} x2={50} y2={80} stroke={strokeColor} strokeWidth={4} />
        <line x1={24} y1={76} x2={34} y2={66} stroke={strokeColor} strokeWidth={4} />
        <line x1={12} y1={60} x2={20} y2={50} stroke={strokeColor} strokeWidth={4} />
        {/* Rieles */}
        <path d="M 58 100 A 58 58 0 0 1 0 42" fill="none" stroke={strokeColor} strokeWidth={2} />
        <path d="M 42 100 A 42 42 0 0 1 0 58" fill="none" stroke={strokeColor} strokeWidth={2} />
      </g>
    )
  }

  return null
}
