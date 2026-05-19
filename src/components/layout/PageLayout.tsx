import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="handheld-container">
      {/* Marco de Consola Táctil (Double-Bezel) */}
      <div className="handheld-bezel">
        {/* Cabina superior del dispositivo / Chasis Hardware */}
        <div className="handheld-hardware-bar">
          <span className="hardware-title-desktop">[ GAMEVERSE CONSOLE OS V1.0.0 ]</span>
          <span className="hardware-title-mobile">[ GV-OS V1.0 ]</span>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <span>● OFFLINE</span>
            <span style={{ color: 'var(--color-accent-text)' }}>● 100%</span>
          </div>
        </div>

        <Header />
        
        <main className="handheld-main">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
