import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from '@/i18n/provider'
import { PageTransitionProvider } from '@/components/layout/PageTransitionWrapper'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import App from './App'
import '@/styles/globals.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <PageTransitionProvider>
          <App />
        </PageTransitionProvider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
)
