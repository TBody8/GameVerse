import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import ScrambleText from './ScrambleText'

export default function ConsoleHeader() {
  // 'scramble' -> 'blink' -> 'collapse'
  const [stage, setStage] = useState<'scramble' | 'blink' | 'collapse'>('scramble')

  const containerRef = useRef<HTMLHeadingElement>(null)
  const prefixGroupRef = useRef<HTMLSpanElement>(null) // Contiene "SYS.LOAD //"
  const sysLoadTextRef = useRef<HTMLSpanElement>(null) // Contiene solo "SYS.LOAD"
  const slashTextRef = useRef<HTMLSpanElement>(null) // Contiene " //"

  useEffect(() => {
    if (stage === 'blink') {
      // Estado 2: Parpadear SOLO "SYS.LOAD" lentamente (efecto neón analógico)
      const blinkTween = gsap.fromTo(
        sysLoadTextRef.current,
        { opacity: 0.3, filter: 'drop-shadow(0 0 1px var(--color-accent))' },
        {
          opacity: 1,
          filter: 'drop-shadow(0 0 8px var(--color-accent-hover))',
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }
      )

      // Después de 2.5s, transicionar el colapso de forma cinética
      const timer = setTimeout(() => {
        blinkTween.kill()
        setStage('collapse')
      }, 2500)

      return () => {
        clearTimeout(timer)
        blinkTween.kill()
      }
    }

    if (stage === 'collapse') {
      // Estado 3: Animación cinéticamente elástica y profesional usando GSAP
      const tl = gsap.timeline()

      // Desvanecer el texto y las barras diagonales a la izquierda
      tl.to([sysLoadTextRef.current, slashTextRef.current], {
        opacity: 0,
        x: -16,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power3.in',
      })
      // Colapsar el ancho elásticamente y juntar la flecha
      .to(
        prefixGroupRef.current,
        {
          width: 0,
          marginRight: 0,
          duration: 0.55,
          ease: 'power4.inOut',
        },
        '-=0.2'
      )
    }
  }, [stage])

  return (
    <h1
      ref={containerRef}
      className="neon-header-display"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 1,
      }}
    >
      {/* Flecha Izquierda Fija */}
      <span style={{ marginRight: 'var(--space-2)', userSelect: 'none' }}>◀</span>

      {/* Bloque Dinámico Colapsable: "SYS.LOAD //" */}
      <span
        ref={prefixGroupRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          marginRight: stage === 'collapse' ? 0 : 'var(--space-2)',
        }}
      >
        {stage === 'scramble' ? (
          <ScrambleText
            text="SYS.LOAD //"
            duration={500}
            delay={100}
            onComplete={() => {}}
          />
        ) : (
          <>
            <span ref={sysLoadTextRef}>SYS.LOAD</span>
            <span ref={slashTextRef} style={{ marginLeft: 'var(--space-2)' }}>//</span>
          </>
        )}
      </span>

      {/* Título Principal Fijo */}
      <span>
        {stage === 'scramble' ? (
          <ScrambleText
            text="SELECCIONAR CARTUCHO"
            duration={900}
            delay={200}
            onComplete={() => setStage('blink')}
          />
        ) : (
          "SELECCIONAR CARTUCHO"
        )}
      </span>

      {/* Flecha Derecha Fija */}
      <span style={{ marginLeft: 'var(--space-2)', userSelect: 'none' }}>▶</span>
    </h1>
  )
}
