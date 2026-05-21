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
    // Pantalla de carga mínima — usa el mismo fondo oscuro del tema
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060907',
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

// Hook de conveniencia para cambiar idioma desde cualquier componente.
// Lee el locale directamente de i18n para estar siempre sincronizado,
// y fuerza un re-render local al cambiar.
export function useLocale() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    () => (i18n.locale as Locale) || 'es'
  )

  // Sincronizar si el locale cambia desde otro componente / instancia
  useEffect(() => {
    const locale = (i18n.locale as Locale) || 'es'
    if (locale !== currentLocale) {
      setCurrentLocale(locale)
    }
  })

  const changeLocale = async (locale: Locale) => {
    await activateLocale(locale)
    // Actualizar estado local para disparar re-render inmediato
    setCurrentLocale(locale)
  }

  return { currentLocale, changeLocale }
}
