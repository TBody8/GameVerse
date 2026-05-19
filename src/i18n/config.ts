import { i18n } from '@lingui/core'

export type Locale = 'es' | 'en' | 'fr' | 'pt' | 'zh' | 'hi' | 'ar'

export const LOCALES: Record<Locale, { label: string; nativeName: string; rtl: boolean }> = {
  es: { label: 'Español', nativeName: 'Español', rtl: false },
  en: { label: 'English', nativeName: 'English', rtl: false },
  fr: { label: 'Français', nativeName: 'Français', rtl: false },
  pt: { label: 'Português', nativeName: 'Português', rtl: false },
  zh: { label: 'Chinese', nativeName: '中文简体', rtl: false },
  hi: { label: 'Hindi', nativeName: 'हिन्दी', rtl: false },
  ar: { label: 'Arabic', nativeName: 'العربية', rtl: true },
}

export const DEFAULT_LOCALE: Locale = 'es'
const STORAGE_KEY = 'gameverse_locale'

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && stored in LOCALES) return stored as Locale
  } catch {
    // localStorage no disponible (modo privado, etc.)
  }
  return DEFAULT_LOCALE
}

function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // silencioso
  }
}

async function loadCatalog(locale: Locale) {
  const { messages } = await import(`./locales/${locale}/messages.js`)
  return messages
}

export async function activateLocale(locale: Locale): Promise<void> {
  const messages = await loadCatalog(locale)
  i18n.loadAndActivate({ locale, messages })

  storeLocale(locale)

  // RTL para Arabic
  const dir = LOCALES[locale].rtl ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', locale)
}

export async function initI18n(): Promise<void> {
  const locale = getStoredLocale()
  await activateLocale(locale)
}

export { i18n }
