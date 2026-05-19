import { useState, useEffect, type ReactNode } from 'react'
import { I18nProvider as LinguiI18nProvider } from '@lingui/react'
import { i18n, initI18n, activateLocale, type Locale } from './config'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initI18n().then(() => setReady(true))
  }, [])

  if (!ready) {
    // Pantalla de carga mínima mientras se inicializa el idioma
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F6F3',
        }}
      />
    )
  }

  return (
    <LinguiI18nProvider i18n={i18n}>
      {children}
    </LinguiI18nProvider>
  )
}

// Hook de conveniencia para cambiar idioma desde cualquier componente
export function useLocale() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    () => (i18n.locale as Locale) || 'es'
  )

  const changeLocale = async (locale: Locale) => {
    await activateLocale(locale)
    setCurrentLocale(locale)
  }

  return { currentLocale, changeLocale }
}
