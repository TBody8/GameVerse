import { useEffect, useRef } from 'react'
import { Puzzle, ValidationResult, Bridge as BridgeType, Island } from '../logic/types'
import IslandNode from './Island'
import Bridge from './Bridge'
import { playBridgePlace, playBridgeUpgrade, playBridgeRemove } from '@/utils/audio'

interface BoardProps {
  puzzle: Puzzle
  bridges: BridgeType[]
  validation: ValidationResult
  hintedIslandId: string | null
  selectedIslandId: string | null
  onSelectIsland: (id: string) => void
}

export default function Board({ puzzle, bridges, validation, hintedIslandId, selectedIslandId, onSelectIsland }: BoardProps) {
  // Cuadrícula estricta y absoluta
  const svgWidth = puzzle.gridSize * 60
  const svgHeight = puzzle.gridSize * 60

  const prevBridgesRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const prev = prevBridgesRef.current
    const curr: Record<string, number> = {}
    bridges.forEach(b => { curr[b.id] = b.count })
    
    // Comparar para sonidos y tracking
    bridges.forEach(b => {
      const prevCount = prev[b.id] || 0
      if (prevCount === 0 && b.count === 1) {
        playBridgePlace()
      } else if (prevCount === 1 && b.count === 2) {
        playBridgeUpgrade()
      }
    })

    // Chequear removidos
    Object.keys(prev).forEach(id => {
      if (!curr[id]) playBridgeRemove()
    })

    prevBridgesRef.current = curr
  }, [bridges])

  // Identificar guías posibles desde la isla seleccionada
  const validGuideTargets: Island[] = []
  const selectedIsland = selectedIslandId ? puzzle.islands.find(i => i.id === selectedIslandId) : null
  
  if (selectedIsland) {
    const isPathBlocked = (r1: number, c1: number, r2: number, c2: number): boolean => {
      const minR = Math.min(r1, r2)
      const maxR = Math.max(r1, r2)
      const minC = Math.min(c1, c2)
      const maxC = Math.max(c1, c2)
      for (const isl of puzzle.islands) {
        if (isl.id === selectedIsland.id) continue
        if (r1 === r2 && isl.pos.row === r1 && isl.pos.col > minC && isl.pos.col < maxC) return true
        if (c1 === c2 && isl.pos.col === c1 && isl.pos.row > minR && isl.pos.row < maxR) return true
      }
      return false
    }

    // Buscar en las 4 direcciones
    const directions = [
      { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
    ]

    directions.forEach(({ dr, dc }) => {
      let r = selectedIsland.pos.row + dr
      let c = selectedIsland.pos.col + dc
      while (r >= 0 && r < puzzle.gridSize && c >= 0 && c < puzzle.gridSize) {
        const target = puzzle.islands.find(i => i.pos.row === r && i.pos.col === c)
        if (target) {
          if (!isPathBlocked(selectedIsland.pos.row, selectedIsland.pos.col, target.pos.row, target.pos.col)) {
            validGuideTargets.push(target)
          }
          break // Paramos al encontrar la primera isla en esta dirección
        }
        r += dr
        c += dc
      }
    })
  }

  return (
    <div 
      className="board-container"
      style={{
        width: '100%',
        maxWidth: '500px',
        aspectRatio: '1 / 1', // Siempre un cuadrado perfecto
        background: 'radial-gradient(circle at center, #0B1C1D 0%, #050B0B 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid rgba(13, 148, 136, 0.15)',
        boxShadow: '0 0 20px rgba(13, 148, 136, 0.1) inset, var(--shadow-neon-glow)',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => onSelectIsland('')} // Clic afuera deselecciona
    >
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <pattern id="ocean-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(13, 148, 136, 0.04)" strokeWidth="1"/>
            <circle cx="30" cy="30" r="1.5" fill="rgba(13, 148, 136, 0.15)" />
            <path d="M 0 -3 L 0 3 M -3 0 L 3 0" fill="none" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="1" />
          </pattern>
          
          <style>
            {`
              @keyframes guideFlow {
                from { stroke-dashoffset: 20; }
                to { stroke-dashoffset: 0; }
              }
              .guide-line {
                animation: guideFlow 1s linear infinite;
              }
            `}
          </style>
        </defs>

        <rect width={svgWidth} height={svgHeight} fill="url(#ocean-grid)" />

        {/* --- Guías de Conexión --- */}
        {selectedIsland && validGuideTargets.map(target => {
          const x1 = selectedIsland.pos.col * 60 + 30
          const y1 = selectedIsland.pos.row * 60 + 30
          const x2 = target.pos.col * 60 + 30
          const y2 = target.pos.row * 60 + 30
          return (
            <line
              key={`guide-${target.id}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(245, 158, 11, 0.2)"
              strokeWidth="2"
              strokeDasharray="4 6"
              className="guide-line"
              style={{ pointerEvents: 'none' }}
            />
          )
        })}

        {bridges.map(b => {
          const prevCount = prevBridgesRef.current[b.id] || 0
          
          // Pasar el string exacto si somos el error, para que el timestamp fuerce la animación GSAP
          const errorHintMatch = hintedIslandId !== null && hintedIslandId.startsWith(`error_${b.id}_`) ? hintedIslandId : false

          return (
            <Bridge 
              key={b.id} 
              bridge={b} 
              islands={puzzle.islands} 
              isInvalid={validation.invalidBridges.includes(b.id)}
              prevCount={prevCount}
              errorHintStr={errorHintMatch}
            />
          )
        })}
        {puzzle.islands.map(isl => {
          // Comprobar si esta isla forma parte de la sugerencia PAIR del Hint
          let isIslandHinted = false
          if (hintedIslandId && hintedIslandId.startsWith('pair_')) {
            const parts = hintedIslandId.split('_')
            if (parts[1] === isl.id || parts[2] === isl.id) {
              isIslandHinted = true
            }
          }

          return (
            <IslandNode 
              key={isl.id} 
              island={isl} 
              status={validation.islandStatus[isl.id] || 'incomplete'}
              isSelected={selectedIslandId === isl.id}
              isHinted={isIslandHinted ? (hintedIslandId || false) : false}
              onClick={onSelectIsland}
            />
          )
        })}
      </svg>
    </div>
  )
}
