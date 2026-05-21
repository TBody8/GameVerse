import { type ReactNode, useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useBattery } from '@/hooks/useBattery'
import { playBootSound } from '@/utils/audio'
import { Power } from '@phosphor-icons/react'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  const batteryLevel = useBattery()
  
  // Guardar el estado de encendido en el estado para requerir un primer tap interactivo (evita bloqueo de audio del navegador)
  const [isPoweredOn, setIsPoweredOn] = useState(() => {
    // Si ya interactuó en esta pestaña, mantén la consola encendida
    return sessionStorage.getItem('gameverse_powered') === 'true'
  })
  
  const [bootClass, setBootClass] = useState('')

  const handlePowerOn = () => {
    sessionStorage.setItem('gameverse_powered', 'true')
    setIsPoweredOn(true)
    playBootSound()
    setBootClass('boot-flicker')
  }

  // Si está encendido, quitar la animación de flicker después de que termine
  useEffect(() => {
    if (bootClass) {
      const timer = setTimeout(() => setBootClass(''), 500)
      return () => clearTimeout(timer)
    }
  }, [bootClass])

  return (
    <div className={`handheld-container ${bootClass}`}>
      {/* Marco de Consola Táctil (Double-Bezel) */}
      <div className="handheld-bezel">
        {/* Cabina superior del dispositivo / Chasis Hardware */}
        <div className="handheld-hardware-bar">
          <span className="hardware-title-desktop">[ GAMEVERSE CONSOLE OS V1.0.0 ]</span>
          <span className="hardware-title-mobile">[ GV-OS V1.0 ]</span>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <span>● OFFLINE</span>
            <span style={{ color: 'var(--color-accent-text)', textShadow: 'var(--shadow-neon-text)' }}>
              {batteryLevel.isSupported
                ? `● ${batteryLevel.level}%${batteryLevel.isCharging ? ' ⚡' : ''}`
                : '● PWR OK'}
            </span>
          </div>
        </div>

        {isPoweredOn ? (
          <>
            <Header />
            <main className="handheld-main">
              {children}
            </main>
            <Footer />
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              minHeight: '450px',
              backgroundColor: '#050706',
              padding: 'var(--space-8)',
            }}
          >
            {/* Botón de Encendido Físico de Neón */}
            <button
              onClick={handlePowerOn}
              className="neon-glow-hover"
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '2px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-accent-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-neon-glow)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-text)'
              }}
            >
              <Power size={32} weight="bold" />
            </button>
            
            <span
              className="font-mono text-glow"
              style={{
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                letterSpacing: 'var(--tracking-wide)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginTop: 'var(--space-2)',
              }}
            >
              [ TOCA PARA ENCENDER ]
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
