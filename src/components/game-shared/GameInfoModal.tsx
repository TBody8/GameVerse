import { X } from '@phosphor-icons/react'
import { playTick } from '@/utils/audio'

export interface GameRuleSection {
  title: string
  content: string[]
}

interface GameInfoModalProps {
  gameName: string
  sections: GameRuleSection[]
  onClose: () => void
}

export default function GameInfoModal({ gameName, sections, onClose }: GameInfoModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 9, 7, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100, // Por encima de casi todo
        padding: 'var(--space-6)',
      }}
      onClick={(e) => {
        // Cerrar si hace click fuera del modal
        if (e.target === e.currentTarget) {
          playTick()
          onClose()
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '85vh',
          backgroundColor: 'var(--color-surface)',
          border: '2px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-neon-glow)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Cabecera del Modal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-2)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              textShadow: 'var(--shadow-neon-text)',
              letterSpacing: 'var(--tracking-tight)',
              margin: 0,
            }}
          >
            [ INFO: {gameName.toUpperCase()} ]
          </h3>
          <button
            onClick={() => {
              playTick()
              onClose()
            }}
            className="neon-glow-hover"
            aria-label="Cerrar información"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-error)'
              e.currentTarget.style.borderColor = 'var(--color-error-subtle)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Cuerpo con Scroll (Las reglas) */}
        <div
          style={{
            padding: 'var(--space-6)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-accent-text)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wide)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '10px' }}>{String(idx + 1).padStart(2, '0')} //</span>
                {section.title}
              </h4>
              <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {section.content.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-3)',
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: 'var(--color-accent-subtle)', marginTop: '2px' }}>●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
