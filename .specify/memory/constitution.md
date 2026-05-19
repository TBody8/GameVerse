# GameVerse Constitution

## Principios Fundamentales

### I. Mobile-First (NO NEGOCIABLE)
Todo diseño y desarrollo DEBE partir de la pantalla más pequeña (375px) y escalar hacia arriba.
- Elementos táctiles: mínimo 44x44px de área de interacción
- Nunca usar `h-screen` — siempre `min-h-[100dvh]` para evitar saltos en iOS Safari
- Layouts asimétricos en desktop DEBEN colapsar a una sola columna en mobile (`< 768px`)
- El juego debe ser completamente funcional y disfrutable en un teléfono, sin zoom ni scroll horizontal

### II. Modularidad de Juegos (NO NEGOCIABLE)
Cada juego es un módulo completamente independiente y auto-contenido.
- Cada juego vive en `src/games/<nombre-juego>/` con su propia lógica, componentes, hooks y assets
- El único punto de integración con la app es `src/games/registry.ts` (1 entrada por juego)
- Un juego NO puede importar código de otro juego
- La lógica pura de un juego (validación, tipos, puzzles) DEBE estar separada de su UI
- Añadir un juego nuevo NO debe requerir modificar ningún archivo existente excepto `registry.ts`

### III. Zero-Backend (NO NEGOCIABLE)
La aplicación es 100% cliente. Sin servidor, sin base de datos, sin autenticación.
- Estado del juego: `useState` / `useReducer` local al componente
- Persistencia de preferencias (idioma, estadísticas, progreso): únicamente `localStorage`
- Sin llamadas a APIs externas en runtime
- Sin autenticación ni cuentas de usuario
- La app DEBE funcionar completamente offline (PWA con service worker)

### IV. Performance (NO NEGOCIABLE)
La experiencia debe ser fluida a 60fps en dispositivos móviles de gama media.
- Animar EXCLUSIVAMENTE vía `transform` y `opacity` — nunca `top`, `left`, `width`, `height`
- `will-change: transform` solo en elementos que están animando activamente
- Animaciones continuas/perpetuas DEBEN estar aisladas en su propio componente con `React.memo`
- Usar `IntersectionObserver` para scroll-entry — NUNCA `window.addEventListener('scroll')`
- Target Lighthouse: >90 en Performance, Accesibilidad, Best Practices, SEO
- Carga inicial: <2 segundos en conexión 4G
- Lazy loading de módulos de juego con `React.lazy()` + `Suspense`

### V. Simplicidad (NO NEGOCIABLE)
YAGNI: You Aren't Gonna Need It. No sobrediseñar, no sobre-ingenierizar.
- Estado global solo cuando haya prop-drilling profundo justificado (>3 niveles)
- Preferir composición de componentes pequeños sobre componentes grandes y complejos
- Sin abstracciones prematuras
- Cada archivo tiene una responsabilidad clara y única
- Complejidad añadida DEBE justificarse explícitamente

## Diseño y UX

### Estética
- Skill activo: `minimalist-ui` — warm monochrome palette, tipografía Geist, bento grids
- Color de acento único: verde esmeralda `#059669` (emerald-600) sobre base neutra
- Paleta completa definida en `src/styles/globals.css` como variables CSS
- Fuentes: Geist Sans (UI/body) + Geist Mono (contadores, timers, metadata)
- Sin emojis en código, markup ni contenido de texto
- Sin Inter, Roboto, Open Sans
- Sin sombras pesadas — máximo `rgba(0,0,0,0.06)` de difusión

### Internacionalización
- 7 idiomas: Español (default), English, Français, Português, 中文简体, हिन्दी, العربية
- Librería: LinguiJS v6+ (runtime mínimo de 2-5KB)
- Arabic requiere `dir="rtl"` en `<html>` y overrides CSS en `src/styles/rtl.css`
- El idioma activo se persiste en `localStorage` bajo la clave `gameverse_locale`
- Selector de idioma: discreta esquina superior derecha del Header, ícono globo (Phosphor)

## Tecnología

### Stack (cerrado — no cambiar sin justificación explícita)
- Framework: React 18 + Vite 6
- Lenguaje: TypeScript 5 (strict mode)
- Routing: wouter v3 (~1.4KB gzip)
- i18n: LinguiJS v6
- Animaciones: GSAP v3.12+
- Tableros de juego: SVG nativo
- Iconos: @phosphor-icons/react (Bold/Fill weight)
- PWA: vite-plugin-pwa v1.x (generateSW strategy)

## Governance

Esta constitución rige todas las decisiones de desarrollo. Cualquier excepción a los principios NO NEGOCIABLES debe documentarse explícitamente en el PR/commit con justificación técnica.

Los principios son evaluados en cada nueva feature antes de implementar.

**Version**: 1.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19
