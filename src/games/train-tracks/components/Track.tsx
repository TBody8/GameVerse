import { type TrackPieceType } from '../logic/orientation'

interface TrackProps {
  type: TrackPieceType
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes de diseño (Ladder Style con curvas concéntricas)
// ─────────────────────────────────────────────────────────────────────────────

const O = 8 // Offset de los rieles (ancho entre rieles = 16)
const Rc = 20 // Radio central para las curvas
const Ro = Rc + O // 28 - Radio del riel exterior
const Ri = Rc - O // 12 - Radio del riel interior

const SLEEPER_STROKE = '#E1F8EC' // Blanco/Verde muy claro (fósforo)
const SLEEPER_W = 24 // Ancho que atraviesa la vía (sobresale un poco de los rieles)
const SLEEPER_DASH = '3 20' // 3px de grosor, 20px de hueco

const RAIL_STROKE = '#10B981' // Rieles de neón verde
const RAIL_W = 2.5
const RAIL_FILTER = 'drop-shadow(0 0 3px #059669) drop-shadow(0 0 8px rgba(16,185,129,0.5))'

// ─────────────────────────────────────────────────────────────────────────────
// Componente de capas
// ─────────────────────────────────────────────────────────────────────────────
function TrackLayers({
  center,
  outer,
  inner,
}: {
  center: string
  outer: string
  inner: string
}) {
  return (
    <g>
      {/* Capa 1 — Durmientes (Traviesas estilo escalera) */}
      <path
        d={center}
        fill="none"
        stroke={SLEEPER_STROKE}
        strokeWidth={SLEEPER_W}
        strokeDasharray={SLEEPER_DASH}
        strokeLinecap="butt"
      />
      {/* Capa 2a — Riel exterior */}
      <path
        d={outer}
        fill="none"
        stroke={RAIL_STROKE}
        strokeWidth={RAIL_W}
        strokeLinecap="square"
        style={{ filter: RAIL_FILTER }}
      />
      {/* Capa 2b — Riel interior */}
      <path
        d={inner}
        fill="none"
        stroke={RAIL_STROKE}
        strokeWidth={RAIL_W}
        strokeLinecap="square"
        style={{ filter: RAIL_FILTER }}
      />
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────
export default function Track({ type }: TrackProps) {
  if (type === 'none') return null

  if (type === 'straight-h') {
    return (
      <TrackLayers
        center={`M 0,50 L 100,50`}
        outer={`M 0,42 L 100,42`}
        inner={`M 0,58 L 100,58`}
      />
    )
  }

  if (type === 'straight-v') {
    return (
      <TrackLayers
        center={`M 50,0 L 50,100`}
        outer={`M 42,0 L 42,100`}
        inner={`M 58,0 L 58,100`}
      />
    )
  }

  if (type === 'curve-ne') {
    return (
      <TrackLayers
        center={`M 50,0 L 50,30 A ${Rc},${Rc} 0 0,0 70,50 L 100,50`}
        outer={`M 42,0 L 42,30 A ${Ro},${Ro} 0 0,0 70,58 L 100,58`}
        inner={`M 58,0 L 58,30 A ${Ri},${Ri} 0 0,0 70,42 L 100,42`}
      />
    )
  }

  if (type === 'curve-nw') {
    return (
      <TrackLayers
        center={`M 50,0 L 50,30 A ${Rc},${Rc} 0 0,1 30,50 L 0,50`}
        outer={`M 58,0 L 58,30 A ${Ro},${Ro} 0 0,1 30,58 L 0,58`}
        inner={`M 42,0 L 42,30 A ${Ri},${Ri} 0 0,1 30,42 L 0,42`}
      />
    )
  }

  if (type === 'curve-se') {
    return (
      <TrackLayers
        center={`M 50,100 L 50,70 A ${Rc},${Rc} 0 0,1 70,50 L 100,50`}
        outer={`M 42,100 L 42,70 A ${Ro},${Ro} 0 0,1 70,42 L 100,42`}
        inner={`M 58,100 L 58,70 A ${Ri},${Ri} 0 0,1 70,58 L 100,58`}
      />
    )
  }

  if (type === 'curve-sw') {
    return (
      <TrackLayers
        center={`M 50,100 L 50,70 A ${Rc},${Rc} 0 0,0 30,50 L 0,50`}
        outer={`M 58,100 L 58,70 A ${Ro},${Ro} 0 0,0 30,42 L 0,42`}
        inner={`M 42,100 L 42,70 A ${Ri},${Ri} 0 0,0 30,58 L 0,58`}
      />
    )
  }

  if (type === 'overpass') {
    return (
      <g>
        {/* Vía horizontal debajo */}
        <TrackLayers
          center={`M 0,50 L 100,50`}
          outer={`M 0,42 L 100,42`}
          inner={`M 0,58 L 100,58`}
        />
        {/* Separador para dar efecto de paso elevado (mismo color que el fondo) */}
        <rect x="36" y="36" width="28" height="28" fill="var(--color-canvas)" opacity="0.9" />
        {/* Vía vertical por encima */}
        <TrackLayers
          center={`M 50,0 L 50,100`}
          outer={`M 42,0 L 42,100`}
          inner={`M 58,0 L 58,100`}
        />
      </g>
    )
  }

  return null
}
