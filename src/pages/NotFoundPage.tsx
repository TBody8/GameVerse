import PageLayout from '@/components/layout/PageLayout'
import { Link } from 'wouter'

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-16) 0',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-5xl)',
            fontWeight: 700,
            marginBottom: 'var(--space-4)',
          }}
        >
          404
        </h1>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          La página o juego que buscas no existe.
        </p>
        <Link
          href="/"
          style={{
            padding: 'var(--space-3) var(--space-6)',
            backgroundColor: 'var(--color-btn-primary-bg)',
            color: 'var(--color-btn-primary-text)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            fontSize: 'var(--text-sm)',
            transition: 'background-color var(--transition-fast)',
            textDecoration: 'none',
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </PageLayout>
  )
}
