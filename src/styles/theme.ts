// Tokens de diseño exportados para uso en TypeScript/JS
// Usar variables CSS en componentes cuando sea posible

export const colors = {
  canvas: '#F7F6F3',
  surface: '#FFFFFF',
  surface2: '#F9F9F8',
  border: '#EAEAEA',
  borderSubtle: 'rgba(0, 0, 0, 0.06)',
  textPrimary: '#2F3437',
  textSecondary: '#787774',
  textInverse: '#FFFFFF',
  textDisabled: '#B0ADAA',
  accent: '#059669',
  accentHover: '#047857',
  accentActive: '#065F46',
  accentSubtle: '#D1FAE5',
  accentText: '#065F46',
  success: '#059669',
  successSubtle: '#D1FAE5',
  error: '#DC2626',
  errorSubtle: '#FEE2E2',
  warning: '#D97706',
  warningSubtle: '#FEF3C7',
  btnPrimaryBg: '#111111',
  btnPrimaryHover: '#333333',
} as const

export const fonts = {
  sans: "'Geist', 'Helvetica Neue', Arial, sans-serif",
  mono: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
} as const

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  pill: '9999px',
} as const

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  base: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '600ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const
