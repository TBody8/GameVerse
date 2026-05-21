import { Island } from '../logic/types'
import { playSelect, playDeselect } from '@/utils/audio'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface IslandProps {
  island: Island
  status: 'incomplete' | 'exact' | 'exceeded'
  isSelected: boolean
  isHinted: boolean | string
  onClick: (id: string) => void
}

export default function IslandNode({ island, status, isSelected, isHinted, onClick }: IslandProps) {
  const gRef = useRef<SVGGElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const mainRef = useRef<SVGCircleElement>(null)
  const prevSelectedRef = useRef(false)
  
  const x = island.pos.col * 60 + 30
  const y = island.pos.row * 60 + 30
  
  let stroke = 'rgba(212, 168, 67, 0.3)' // Arena apagado
  let fill = 'rgba(212, 168, 67, 0.05)'
  let numberColor = '#E1F8EC' // Mantener legibilidad blanca
  let warningColor = 'rgba(212, 168, 67, 0.5)' // Warning color arena
  
  if (status === 'exact') {
    stroke = '#F59E0B' // Ambar Brillante
    fill = 'rgba(245, 158, 11, 0.15)'
    numberColor = '#FDE68A'
    warningColor = '#F59E0B'
  } else if (status === 'exceeded') {
    stroke = 'var(--color-error)'
    fill = 'var(--color-error-subtle)'
    numberColor = 'var(--color-error)'
    warningColor = 'var(--color-error)'
  }

  // FIX: Board ya hace el filtrado. Si recibimos un string en isHinted, somos la isla elegida para parpadear.
  const isHintedPulse = typeof isHinted === 'string'

  // Sound on select/deselect
  useEffect(() => {
    if (isSelected && !prevSelectedRef.current) {
      playSelect()
    } else if (!isSelected && prevSelectedRef.current) {
      playDeselect()
    }
    prevSelectedRef.current = isSelected
  }, [isSelected])

  // Selection animation
  useEffect(() => {
    if (!mainRef.current || !ringRef.current) return

    if (isSelected) {
      gsap.killTweensOf(mainRef.current, 'scale,strokeWidth')
      gsap.killTweensOf(ringRef.current, 'rotation')

      gsap.to(mainRef.current, {
        scale: 1.08,
        strokeWidth: 3,
        duration: 0.2,
        ease: 'power2.out',
        transformOrigin: 'center'
      })

      gsap.set(ringRef.current, { transformOrigin: "50% 50%" })
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: 'none'
      })
    } else {
      gsap.killTweensOf(mainRef.current, 'scale,strokeWidth')
      gsap.killTweensOf(ringRef.current, 'rotation')

      gsap.to(mainRef.current, {
        scale: 1,
        strokeWidth: 2,
        duration: 0.15,
        ease: 'power2.in',
        transformOrigin: 'center'
      })

      gsap.set(ringRef.current, { rotation: 0 })
    }
  }, [isSelected])

  // Hint animation
  useEffect(() => {
    if (isHintedPulse && mainRef.current) {
      gsap.fromTo(mainRef.current,
        { scale: 1 },
        { scale: 1.2, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }
      )
    }
  }, [isHinted]) 

  // Status change animations
  useEffect(() => {
    if (!mainRef.current || !ringRef.current) return

    // Limpiar animaciones previas atadas al estado
    gsap.killTweensOf(mainRef.current, 'scale')
    gsap.killTweensOf(ringRef.current, 'scale,opacity')

    if (status === 'exact') {
      // Restaurar valores base
      gsap.set(ringRef.current, { scale: 1, opacity: isSelected ? 0.7 : 0.3 })
      
      gsap.fromTo(mainRef.current,
        { scale: 1 },
        { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut', transformOrigin: 'center' }
      )
    } else if (status === 'exceeded') {
      // Warning Beacon Effect (Baliza de alerta)
      gsap.fromTo(ringRef.current,
        { scale: 1, opacity: isSelected ? 0.7 : 0.4 },
        { 
          scale: 1.15, 
          opacity: 0.9, 
          duration: 0.8, 
          yoyo: true, 
          repeat: -1, 
          ease: 'sine.inOut', 
          transformOrigin: 'center' 
        }
      )
    } else {
      // Incomplete state, reset visual overrides
      gsap.to(mainRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' })
      gsap.to(ringRef.current, { scale: 1, opacity: isSelected ? 0.7 : 0.3, duration: 0.2 })
    }
  }, [status, isSelected])

  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(island.id);
      }}
      style={{ cursor: 'pointer' }}
    >
      <g ref={gRef} style={{ transformOrigin: 'center' }}>
        {/* Anillo exterior decorativo (rota cuando seleccionado, pulsa cuando excedido) */}
        <circle
          ref={ringRef}
          r="23"
          fill="none"
          stroke={isSelected ? (status === 'exact' ? '#FDE68A' : 'var(--color-accent-text)') : warningColor}
          strokeWidth="1"
          strokeDasharray={isSelected ? "8 4" : "0"}
          opacity={isSelected ? 0.7 : 0.3}
          style={{ transition: 'stroke 0.2s ease, opacity 0.2s ease' }}
        />
        
        {/* FONDO SÓLIDO TEAL: Escudo visual para ocultar los puentes que pasan por debajo y fusionarse con el fondo oceánico */}
        <circle 
          r="18" 
          fill="#081515" 
        />

        {/* Círculo principal semi-transparente de Arena */}
        <circle 
          ref={mainRef}
          r="18" 
          fill={fill}
          stroke={isSelected ? (status === 'exact' ? '#FDE68A' : 'var(--color-accent-text)') : stroke}
          strokeWidth="2"
          className={status === 'exact' ? '' : ''} 
          style={{ 
            transition: 'fill 0.2s ease, stroke 0.2s ease',
            filter: status === 'exact' ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' : 'none'
          }}
        />
        
        {/* Número central */}
        <text 
          textAnchor="middle" 
          dy="6"
          fill={numberColor}
          className="font-mono"
          style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            textShadow: status === 'exact' ? '0 0 8px rgba(245, 158, 11, 0.8)' : (status === 'exceeded' ? '0 0 8px rgba(239,68,68,0.6)' : 'none')
          }}
        >
          {island.requiredBridges}
        </text>
      </g>
    </g>
  )
}
