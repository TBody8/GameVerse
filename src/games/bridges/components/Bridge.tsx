import { Bridge as BridgeType, Island } from '../logic/types'
import { useEffect, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

interface BridgeProps {
  bridge: BridgeType
  islands: Island[]
  isInvalid: boolean
  prevCount?: number
  errorHintStr?: string | false
}

export default function Bridge({ bridge, islands, isInvalid, prevCount = 0, errorHintStr = false }: BridgeProps) {
  const lineRef = useRef<SVGLineElement>(null)
  const line2Ref = useRef<SVGLineElement>(null)
  const diamondRef = useRef<SVGPolygonElement>(null)
  const gRef = useRef<SVGGElement>(null)
  
  const fIsl = islands.find(i => i.id === bridge.from)!
  const tIsl = islands.find(i => i.id === bridge.to)!
  
  const x1 = fIsl.pos.col * 60 + 30
  const y1 = fIsl.pos.row * 60 + 30
  const x2 = tIsl.pos.col * 60 + 30
  const y2 = tIsl.pos.row * 60 + 30

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  const strokeColor = isInvalid ? 'var(--color-error)' : '#A65D37' // Mahogany Wood Color
  const glowColor = isInvalid ? 'rgba(239, 68, 68, 0.4)' : 'rgba(166, 93, 55, 0.4)'
  
  const isVert = bridge.isVertical
  const offset = 4

  useLayoutEffect(() => {
    // Animación cuando el puente pasa de 0 a 1
    if (prevCount === 0 && bridge.count >= 1 && lineRef.current) {
      const midXLocal = (x1 + x2) / 2
      const midYLocal = (y1 + y2) / 2
      
      gsap.fromTo(lineRef.current,
        { 
          attr: { 
            x1: midXLocal, y1: midYLocal, 
            x2: midXLocal, y2: midYLocal 
          },
          opacity: 0
        },
        { 
          attr: { x1, y1, x2, y2 },
          opacity: 1,
          duration: 0.25,
          ease: 'back.out(1.4)'
        }
      )
    }

    // Animación cuando el puente pasa de 1 a 2
    if (prevCount === 1 && bridge.count === 2) {
      if (line2Ref.current) {
        gsap.fromTo(line2Ref.current,
          { opacity: 0, strokeWidth: 0 },
          { opacity: 1, strokeWidth: 2.5, duration: 0.2, ease: 'power2.out' }
        )
      }
      if (diamondRef.current) {
        gsap.fromTo(diamondRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', transformOrigin: "center" }
        )
      }
    }
  }, [bridge.count, prevCount, x1, y1, x2, y2])

  useEffect(() => {
    if ((isInvalid || errorHintStr) && (lineRef.current || gRef.current)) {
      gsap.to(gRef.current || lineRef.current, {
        opacity: 0.3,
        stroke: 'var(--color-error)',
        duration: 0.25,
        yoyo: true,
        repeat: 5,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(gRef.current || lineRef.current, { stroke: strokeColor, opacity: 1, duration: 0.2 })
        }
      })
    }
  }, [isInvalid, errorHintStr])

  if (bridge.count === 1) {
    return (
      <line 
        ref={lineRef}
        x1={x1} y1={y1} x2={x2} y2={y2} 
        stroke={strokeColor} 
        strokeWidth="3" 
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
      />
    )
  }

  return (
    <g ref={gRef} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}>
      <line 
        ref={lineRef}
        x1={x1 + (isVert ? offset : 0)} 
        y1={y1 + (isVert ? 0 : offset)} 
        x2={x2 + (isVert ? offset : 0)} 
        y2={y2 + (isVert ? 0 : offset)} 
        stroke={strokeColor} 
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line 
        ref={line2Ref}
        x1={x1 - (isVert ? offset : 0)} 
        y1={y1 - (isVert ? 0 : offset)} 
        x2={x2 - (isVert ? offset : 0)} 
        y2={y2 - (isVert ? 0 : offset)} 
        stroke={strokeColor} 
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <polygon
        ref={diamondRef}
        points={`${midX},${midY - 5} ${midX + 5},${midY} ${midX},${midY + 5} ${midX - 5},${midY}`}
        fill="#081515" /* Color del oceano Teal profundo */
        stroke="#A65D37"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 3px rgba(166, 93, 55, 0.5))' }}
      />
    </g>
  )
}
