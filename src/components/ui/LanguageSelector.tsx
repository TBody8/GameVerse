import { useLocale } from '@/i18n/provider'
import { LOCALES, type Locale } from '@/i18n/config'
import { useState, useRef, useEffect } from 'react'
import { GlobeSimple, Check } from '@phosphor-icons/react'
import { playTick } from '@/utils/audio'

export default function LanguageSelector() {
  const { currentLocale, changeLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="lang-selector-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => {
          playTick()
          setIsOpen(!isOpen)
        }}
        aria-label="Seleccionar idioma"
        className="lang-btn neon-glow-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-2)',
          transition: 'all var(--transition-fast)',
        }}
      >
        <GlobeSimple size={18} weight="bold" />
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
          {LOCALES[currentLocale].nativeName}
        </span>
      </button>

      {isOpen && (
        <ul
          className="lang-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--space-2))',
            right: 0,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-neon-glow)',
            padding: 'var(--space-2) 0',
            minWidth: '160px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {(Object.keys(LOCALES) as Locale[]).map((loc) => (
            <li key={loc} style={{ width: '100%' }}>
              <button
                onClick={() => {
                  playTick()
                  changeLocale(loc)
                  setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'left',
                  color: loc === currentLocale ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
                  backgroundColor: loc === currentLocale ? 'var(--color-accent-subtle)' : 'transparent',
                  transition: 'background-color var(--transition-fast)',
                  textShadow: loc === currentLocale ? 'var(--shadow-neon-text)' : 'none',
                }}
              >
                <span>{LOCALES[loc].nativeName}</span>
                {loc === currentLocale && <Check size={14} weight="bold" color="var(--color-accent)" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
