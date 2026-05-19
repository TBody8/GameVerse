import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        backgroundColor: 'var(--color-canvas)',
        color: 'var(--color-text-primary)',
        position: 'relative',
        padding: 'var(--space-4) var(--space-6)', // Aumento de margen de seguridad externo
      }}
    >
      {/* Marco de Consola Táctil (Double-Bezel) */}
      <div
        className="handheld-bezel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          maxWidth: 'var(--max-w-content)',
          margin: '0 auto', // Centrado perfecto
          backgroundColor: 'var(--color-surface)',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-neon-glow)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Cabina superior del dispositivo / Chasis Hardware */}
        <div
          className="handheld-hardware-bar"
          style={{
            height: '28px',
            backgroundColor: '#0A0D0B',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-8)', // Alineado con el padding general
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-secondary)',
            letterSpacing: 'var(--tracking-wide)',
            fontWeight: 600,
          }}
        >
          <span>[ GAMEVERSE CONSOLE OS V1.0.0 ]</span>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <span>● OFFLINE</span>
            <span style={{ color: 'var(--color-accent-text)' }}>● BATTERY: 100%</span>
          </div>
        </div>

        <Header />
        
        <main
          style={{
            flex: 1,
            width: '100%',
            padding: 'var(--space-8) var(--space-8)', // Armonía y alineación izquierda-derecha
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
