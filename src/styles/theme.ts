// Tokens de diseño exportados para uso en TypeScript/JS
// Sincronizado con la paleta OLED neon de globals.css

export const colors = {
  canvas: '#060907',
  surface: '#0E1310',
  surface2: '#161F1A',
  border: 'rgba(5, 150, 105, 0.25)',
  borderSubtle: 'rgba(5, 150, 105, 0.12)',
  textPrimary: '#E1F8EC',
  textSecondary: '#709F85',
  textInverse: '#060907',
  textDisabled: '#354F41',
  accent: '#059669',
  accentHover: '#10B981',
  accentActive: '#047857',
  accentSubtle: 'rgba(5, 150, 105, 0.15)',
  accentText: '#34D399',
  success: '#059669',
  successSubtle: 'rgba(5, 150, 105, 0.2)',
  error: '#EF4444',
  errorSubtle: 'rgba(239, 68, 68, 0.2)',
  warning: '#F59E0B',
  warningSubtle: 'rgba(245, 158, 11, 0.2)',
  btnPrimaryBg: '#10B981',
  btnPrimaryHover: '#34D399',
} as const

export const fonts = {
  sans: "'Geist', 'Helvetica Neue', Arial, sans-serif",
  mono: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
} as const

export const radius = {
  sm: '6px',
  md: '12px',
  lg: '20px',
  pill: '9999px',
} as const

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  base: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '600ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const
