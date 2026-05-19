import { createContext, useContext, useState, useRef, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import { gsap } from 'gsap'
import { playSwooshSound } from '@/utils/audio'

interface TransitionContextProps {
  navigateWithTransition: (to: string) => void
  isTransitioning: boolean
}

const TransitionContext = createContext<TransitionContextProps | null>(null)

export function usePageTransition() {
  const context = useContext(TransitionContext)
  if (!context) throw new Error('usePageTransition must be used within a PageTransitionProvider')
  return context
}

interface PageTransitionProviderProps {
  children: ReactNode
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [location, setLocation] = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const navigateWithTransition = (to: string) => {
    if (isTransitioning || location === to) return
    setIsTransitioning(true)

    // Reproducir swoosh de consola warp
    playSwooshSound()

    const screen = document.querySelector('.handheld-bezel')
    const overlay = overlayRef.current

    // Acelerar parpadeo de scanline CRT sutilmente de fondo
    document.body.style.setProperty('--flicker-speed', '0.04s')

    const tl = gsap.timeline({
      onComplete: () => {
        // Actualizar la ruta real de wouter
        setLocation(to)
        
        // Fase de llegada: zoom suave desde atrás
        gsap.fromTo(
          screen,
          { scale: 1.08, filter: 'blur(10px)' },
          {
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'all',
            onComplete: () => {
              setIsTransitioning(false)
              document.body.style.setProperty('--flicker-speed', '0.15s') // Resetear parpadeo CRT
            },
          }
        )
      },
    })

    // Animación de salida: Zoom masivo + Desenfoque Radial sutil (efecto warp)
    tl.to(screen, {
      scale: 0.94,
      filter: 'blur(4px)',
      duration: 0.2,
      ease: 'power2.in',
    })
    .to(screen, {
      scale: 3.5,
      filter: 'blur(16px)',
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in',
    })
    .fromTo(
      overlay,
      { opacity: 0 },
      {
        opacity: 1,
        backgroundColor: 'rgba(5, 150, 105, 0.2)', // Destello esmeralda rápido
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      },
      '-=0.35'
    )
  }

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      {/* Overlay para destellos esmeralda rápidos */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
        }}
      />
    </TransitionContext.Provider>
  )
}
