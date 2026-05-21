import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log in development only
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-8)',
            backgroundColor: 'var(--color-canvas)',
          }}
        >
          <div
            style={{
              maxWidth: '420px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-10)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              ⚠
            </div>

            <h2
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--color-text-primary)',
              }}
            >
              Algo salió mal
            </h2>

            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              El juego encontró un error inesperado. Tu progreso guardado no se ha perdido.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
              <button
                onClick={this.handleReset}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
              >
                INTENTAR DE NUEVO
              </button>

              <button
                onClick={() => { window.location.href = '/' }}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                VOLVER AL INICIO
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
