import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import ScrambleText from './ScrambleText'
import { t } from '@lingui/macro'

export default function ConsoleHeader() {
  const [stage, setStage] = useState<'scramble' | 'blink' | 'collapse'>('scramble')

  const containerRef = useRef<HTMLHeadingElement>(null)
  const prefixGroupRef = useRef<HTMLSpanElement>(null)
  const sysLoadTextRef = useRef<HTMLSpanElement>(null)
  const slashTextRef = useRef<HTMLSpanElement>(null)

  const seleccionarCartuchoText = t`SELECCIONAR CARTUCHO`

  useEffect(() => {
    if (stage === 'blink') {
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
      const tl = gsap.timeline()

      tl.to([sysLoadTextRef.current, slashTextRef.current], {
        opacity: 0,
        x: -16,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power3.in',
      }).to(
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
      <span style={{ marginRight: 'var(--space-2)', userSelect: 'none' }}>◀</span>

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

      <span>
        {stage === 'scramble' ? (
          <ScrambleText
            text={seleccionarCartuchoText}
            duration={900}
            delay={200}
            onComplete={() => setStage('blink')}
          />
        ) : (
          seleccionarCartuchoText
        )}
      </span>

      <span style={{ marginLeft: 'var(--space-2)', userSelect: 'none' }}>▶</span>
    </h1>
  )
}
