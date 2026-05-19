# GameVerse — Documento Maestro del Proyecto

> Lee este documento completo antes de escribir una sola línea de código o responder
> cualquier pregunta. Contiene todo lo que necesitas saber para continuar el trabajo.

---

## 1. Identidad del Proyecto

**Nombre**: GameVerse  
**Tipo**: Aplicación web de juegos de lógica y pasatiempos  
**Público objetivo**: Personas que quieren pasar el tiempo en transporte (tren, avión, espera). Jugadores casuales, todas las edades.  
**Propósito**: Una colección de puzzles y juegos de lógica clásicos (estilo 3 en raya, vías de tren, sudoku, etc.) accesibles desde el navegador sin registro, sin instalación obligatoria, y funcionando offline.  
**Filosofía**: Diseño minimalista premium. Sin publicidad. Sin cuentas. Entra y juega.

---

## 2. Estado Actual del Proyecto

**Fase**: Implementación activa  
**Último hito completado**: Constitution + AGENTS.md (Fase 0)  
**Próxima tarea**: Scaffolding del proyecto (Fase 1)

### Juegos implementados
| Juego | Estado | Ruta | Prompt |
|-------|--------|------|--------|
| Train Tracks (Vías de Tren) | Pendiente | `/game/train-tracks` | `games_promts/train_tracks.md` |

### Juegos pendientes de especificación
*(El usuario añadirá nuevos prompts en `/games_promts/` cuando los tenga listos)*

---

## 3. Stack Técnico (CERRADO — No cambiar sin justificación)

| Componente | Tecnología | Versión | Notas |
|------------|-----------|---------|-------|
| Framework | React + Vite | React 18, Vite 6 | SPA pura, sin SSR |
| Lenguaje | TypeScript | 5.x strict | Modo strict activado |
| Routing | wouter | v3 | ~1.4KB gzip, 2 rutas |
| i18n | LinguiJS | v6+ | Build-time compilation, runtime 2-5KB |
| Animaciones | GSAP | v3.12+ | Core + Timeline + plugins |
| Tableros | SVG nativo | — | Para todos los juegos de cuadrícula |
| PWA | vite-plugin-pwa | v1.x | generateSW, offline completo |
| Iconos | @phosphor-icons/react | latest | Bold/Fill weight únicamente |
| Fuentes | Geist Sans + Geist Mono | CDN | Sans para UI, Mono para números/timers |
| Estado | useState/useReducer | React 18 | Local a cada componente/juego |
| Persistencia | localStorage | nativo | Sin backend |

### Dependencias de producción (npm)
```
wouter
gsap
@lingui/core
@lingui/react
@phosphor-icons/react
```

### Dependencias de desarrollo (npm)
```
@lingui/cli
@lingui/vite-plugin
@lingui/swc-plugin
vite-plugin-pwa
@vitejs/plugin-react-swc
typescript
```

---

## 4. Arquitectura del Proyecto

### Estructura de carpetas completa
```
GameVerse/
├── AGENTS.md                          <- ESTE ARCHIVO (leer primero)
├── games_promts/                      <- Prompts de juegos (INPUT del usuario)
│   └── train_tracks.md                <- Especificación del juego Train Tracks
├── .specify/memory/constitution.md    <- Principios del proyecto (leer siempre)
│
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
│
├── src/
│   ├── main.tsx                       <- Entry point: monta App + I18nProvider
│   ├── App.tsx                        <- Router wouter: / y /game/:gameId
│   ├── vite-env.d.ts                  <- Types Vite + PWA reference
│   │
│   ├── i18n/
│   │   ├── config.ts                  <- Setup Lingui, carga dinámica, detección idioma
│   │   ├── provider.tsx               <- I18nProvider + gestión dir="rtl" para Arabic
│   │   └── locales/
│   │       ├── es/messages.po         <- Español (DEFAULT)
│   │       ├── en/messages.po
│   │       ├── fr/messages.po
│   │       ├── pt/messages.po
│   │       ├── zh/messages.po
│   │       ├── hi/messages.po
│   │       └── ar/messages.po         <- Arabic (RTL)
│   │
│   ├── styles/
│   │   ├── globals.css                <- Variables CSS, reset, tipografía, paleta
│   │   ├── theme.ts                   <- Tokens exportados (para uso en JS/TS)
│   │   └── rtl.css                    <- Overrides CSS para dir="rtl" (Arabic)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx             <- Logo + LanguageSelector
│   │   │   ├── Footer.tsx             <- Copyright minimalista
│   │   │   └── PageLayout.tsx         <- max-w-5xl wrapper común
│   │   ├── ui/
│   │   │   ├── GameCard.tsx           <- Card del grid de juegos en HomePage
│   │   │   ├── Button.tsx             <- Botón reutilizable (primary/ghost)
│   │   │   ├── IconButton.tsx         <- Botón icono (reset, back, etc.)
│   │   │   ├── Modal.tsx              <- Modal genérico (victoria, info)
│   │   │   ├── LanguageSelector.tsx   <- Dropdown 7 idiomas (icono globo)
│   │   │   └── Badge.tsx              <- Etiqueta de dificultad (pill)
│   │   └── game-shared/
│   │       ├── GameHeader.tsx         <- Header dentro del juego
│   │       ├── Timer.tsx              <- Cronómetro opcional (Geist Mono)
│   │       ├── DifficultySelector.tsx <- Fácil/Medio/Difícil/Experto
│   │       ├── VictoryScreen.tsx      <- Overlay victoria con stats
│   │       └── GameControls.tsx       <- Reset, Validar, Dificultad
│   │
│   ├── pages/
│   │   ├── HomePage.tsx               <- Grid de juegos disponibles
│   │   └── GamePage.tsx               <- Carga lazy del juego por ID
│   │
│   ├── games/
│   │   ├── registry.ts                <- REGISTRO CENTRAL: id -> metadata + lazy import
│   │   └── train-tracks/              <- Módulo del juego (auto-contenido)
│   │       ├── index.ts
│   │       ├── TrainTracks.tsx
│   │       ├── components/
│   │       │   ├── Board.tsx
│   │       │   ├── Cell.tsx
│   │       │   ├── Track.tsx
│   │       │   ├── Station.tsx
│   │       │   ├── RowIndicator.tsx
│   │       │   └── ColIndicator.tsx
│   │       ├── logic/
│   │       │   ├── types.ts
│   │       │   ├── validator.ts
│   │       │   ├── orientation.ts
│   │       │   └── puzzles.ts         <- Puzzles hardcodeados por dificultad (v1)
│   │       ├── hooks/
│   │       │   ├── useTrainTracks.ts
│   │       │   └── useTrainAnimation.ts
│   │       └── assets/
│   │           └── train.svg
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useStats.ts
│   │   └── usePWA.ts
│   │
│   └── utils/
│       ├── storage.ts
│       └── constants.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── lingui.config.ts
└── package.json
```

---

## 5. Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomePage` | Grid de juegos disponibles. Muestra todas las GameCards. |
| `/game/:gameId` | `GamePage` | Carga el juego correspondiente al ID. Ej: `/game/train-tracks` |
| `*` (fallback) | `NotFoundPage` | 404 si el gameId no existe en el registry |

**El `gameId` es el ID del juego tal como está registrado en `src/games/registry.ts`.**

---

## 6. Sistema de Juegos — Cómo Funciona

### El Registry (`src/games/registry.ts`)
Es el único fichero que conecta los juegos con la app. Exporta un mapa:

```typescript
interface GameMetadata {
  id: string;           // 'train-tracks', 'sudoku', etc.
  nameKey: string;      // clave i18n para el nombre del juego
  descriptionKey: string; // clave i18n para la descripción
  difficulties: ('easy' | 'medium' | 'hard' | 'expert')[];
  component: React.LazyExoticComponent<React.ComponentType>;
  iconName: string;     // nombre del icono Phosphor
  available: boolean;   // false = próximamente (se muestra en el grid pero deshabilitado)
}
```

### Cómo añadir un juego nuevo
1. El usuario añade el prompt del juego en `/games_promts/<nombre>.md`
2. Leer ese prompt para entender las reglas, mecánicas y UI del juego
3. Crear `src/games/<nombre-juego>/` siguiendo la estructura de `train-tracks/`
4. Añadir UNA entrada en `src/games/registry.ts`
5. Añadir las cadenas de texto del juego a los 7 archivos `.po` de `src/i18n/locales/`
6. El juego aparece automáticamente en la HomePage

**REGLA**: Un juego NO importa código de otro juego. Cada módulo es 100% independiente.

---

## 7. Sistema de Diseño

### Skill activo: `minimalist-ui`
El skill completo está en: `.opencode/skills/UXUI/skills/minimalist-skill/SKILL.md`  
**Leerlo siempre antes de escribir cualquier componente visual.**

### Paleta de colores
```css
/* Canvas / Background */
--color-canvas: #F7F6F3;        /* warm bone */
--color-surface: #FFFFFF;        /* cards, modales */
--color-surface-2: #F9F9F8;     /* superficie secundaria */

/* Borders */
--color-border: #EAEAEA;         /* bordes estructurales */
--color-border-subtle: rgba(0,0,0,0.06);

/* Texto */
--color-text-primary: #2F3437;   /* nunca #000000 */
--color-text-secondary: #787774; /* texto muted */
--color-text-inverse: #FFFFFF;

/* Acento único: Verde Esmeralda */
--color-accent: #059669;         /* emerald-600 — acento principal */
--color-accent-hover: #047857;   /* emerald-700 — hover */
--color-accent-subtle: #D1FAE5;  /* emerald-100 — fondos sutiles */
--color-accent-text: #065F46;    /* emerald-800 — texto sobre accent-subtle */

/* Semánticos (solo para feedback de juego) */
--color-success: #059669;        /* correcto (mismo que accent) */
--color-error: #DC2626;          /* rojo-600 — incorrecto/excedido */
--color-warning: #D97706;        /* amber-600 */
```

### Tipografía
```css
/* Fuentes */
--font-sans: 'Geist', 'Helvetica Neue', sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', monospace;

/* Tamaños */
--text-xs: 0.75rem;    /* badges, labels */
--text-sm: 0.875rem;   /* texto secundario */
--text-base: 1rem;     /* body */
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;   /* títulos de sección */
--text-5xl: 3rem;      /* hero h1 */

/* Tracking para títulos grandes */
--tracking-tight: -0.02em;
--tracking-tighter: -0.04em;
```

### Reglas de componentes
- **Bordes**: siempre `1px solid var(--color-border)` — NUNCA más grueso
- **Border-radius**: `8px` (cards pequeñas) o `12px` (cards grandes) — sin `border-radius: 9999px` en contenedores
- **Sombras**: máximo `0 2px 8px rgba(0,0,0,0.04)` — nunca shadow-md/lg/xl
- **Botón primary**: fondo `#111111`, texto blanco, radius `4-6px`, hover `#333333`
- **Botón accent**: fondo `var(--color-accent)`, texto blanco — solo para CTAs principales de juego

### Breakpoints
```
mobile:   < 768px   → 1 columna, px-4
tablet:   768-1024px → 2 columnas, px-6
desktop:  > 1024px  → 2-3 columnas asimétrico, px-8
max-w:    1280px centrado
```

---

## 8. Internacionalización (i18n)

### Librería: LinguiJS v6
- Runtime: 2-5KB gzip (compilación en build-time, no runtime parsing)
- Plugin Vite: `@lingui/vite-plugin`

### Idiomas soportados
| Código | Idioma | Nombre nativo | RTL |
|--------|--------|---------------|-----|
| `es` | Español | Español | No — **DEFAULT** |
| `en` | English | English | No |
| `fr` | Français | Français | No |
| `pt` | Português | Português | No |
| `zh` | Chinese | 中文简体 | No |
| `hi` | Hindi | हिन्दी | No |
| `ar` | Arabic | العربية | **Sí** |

### Persistencia
- Clave localStorage: `gameverse_locale`
- Al cambiar idioma: guardar en localStorage + actualizar `i18n.activate(locale)` + si Arabic, `document.documentElement.dir = 'rtl'`

### LanguageSelector
- Posición: Header, extremo derecho
- Icono: `GlobeSimple` de Phosphor (Bold)
- Al hacer click: popover con lista de 7 idiomas
- Cada idioma muestra su nombre en su propio idioma (no en español)
- El idioma activo tiene un check mark verde (`var(--color-accent)`)

### Añadir una cadena nueva
1. Usar el macro `t` de LinguiJS en el componente: `` t`Mi cadena` ``
2. Ejecutar `lingui extract` para actualizar los `.po`
3. Rellenar la traducción en los 6 ficheros no-default

### RTL (Arabic)
- Cuando locale === 'ar': `document.documentElement.setAttribute('dir', 'rtl')`
- El archivo `src/styles/rtl.css` contiene los overrides necesarios
- Los componentes usan `padding-inline-start`/`padding-inline-end` (logical properties) donde sea posible

---

## 9. Juego: Train Tracks — Referencia Rápida

**Prompt completo**: `games_promts/train_tracks.md`  
**Módulo**: `src/games/train-tracks/`  
**Ruta**: `/game/train-tracks`

### Resumen del juego
- Cuadrícula (4x4 / 6x6 / 8x8 / 10x10)
- Dibujar UNA vía continua de A a B
- Cada fila/columna tiene un número exacto de vías permitidas
- Las vías se auto-orientan según vecinos (rectas y curvas de 90°)

### Estados de celda
1. **Vacío** — click 1
2. **Vía** — click 2 (se dibuja el segmento SVG auto-orientado)
3. **Bloqueada (X)** — click 3 (marca visual para descartar)
→ Cíclico: vacío → vía → bloqueada → vacío

### Validación (5 reglas, implementadas en `logic/validator.ts`)
1. Conteo exacto por fila y columna
2. Camino único y continuo A→B
3. Sin bucles
4. Sin ramificaciones
5. Sin vías muertas

### Feedback visual
- Indicadores numéricos: negro (incompleto) → verde (exacto) → rojo (excedido)
- Victoria: animación GSAP del tren recorriendo la vía + overlay de victoria

### Dificultades y puzzles (v1: puzzles hardcodeados)
| Dificultad | Grid | Puzzles disponibles |
|------------|------|---------------------|
| Fácil | 4x4 | 5 puzzles |
| Medio | 6x6 | 5 puzzles |
| Difícil | 8x8 | 5 puzzles |
| Experto | 10x10 | 3 puzzles |

---

## 10. Animaciones (GSAP)

### Skills disponibles
- `.opencode/skills/gsap-skills-main/skills/gsap-core/SKILL.md`
- `.opencode/skills/gsap-skills-main/skills/gsap-timeline/SKILL.md`
- `.opencode/skills/gsap-skills-main/skills/gsap-performance/SKILL.md`

### Reglas críticas de performance
- NUNCA animar `top`, `left`, `width`, `height`
- SIEMPRE `transform` y `opacity`
- `will-change: transform` solo durante la animación activa, remover después con `onComplete`
- IntersectionObserver para scroll-entry, nunca scroll event listener

### Animaciones implementadas
| Animación | Dónde | Trigger | Técnica |
|-----------|-------|---------|---------|
| Scroll-entry | HomePage cards | IntersectionObserver | `gsap.from()` con stagger |
| Cell tap | Board cells | Click/tap | `gsap.to()` scale bounce |
| Contadores | Row/Col indicators | Estado cambia | `gsap.to()` color |
| Tren victorioso | Board completo | Victoria detectada | `gsap.timeline()` + motionPath |
| Victoria overlay | VictoryScreen | After train anim | `gsap.from()` opacity+y |
| Page transition | Entre rutas | Route change | `gsap.to()` opacity |

---

## 11. PWA (Progressive Web App)

### Configuración
- Plugin: `vite-plugin-pwa` v1.x
- Estrategia: `generateSW` (automática, sin SW manual)
- Register type: `autoUpdate`
- Cache: precache de todos los assets estáticos (`js, css, html, svg, png, woff2`)

### Comportamiento offline
- La app completa funciona sin conexión
- El service worker cachea todo en el primer load
- Updates automáticos: cuando hay nueva versión, se actualiza en background

---

## 12. Convenciones de Código

### Nomenclatura
- Componentes: PascalCase (`GameCard.tsx`, `TrainTracks.tsx`)
- Hooks: camelCase con prefijo `use` (`useTrainTracks.ts`, `useLocalStorage.ts`)
- Archivos de lógica: camelCase (`validator.ts`, `types.ts`)
- Constantes globales: UPPER_SNAKE_CASE (`MAX_GRID_SIZE`)
- Variables/funciones: camelCase

### Estructura de componentes
```typescript
// Orden en cada fichero de componente:
// 1. Imports
// 2. Types/Interfaces locales
// 3. Constantes locales
// 4. Componente principal
// 5. Subcomponentes (si son pequeños y no se reutilizan)
// 6. Export
```

### TypeScript
- Strict mode activado
- Sin `any` — usar `unknown` si el tipo no se conoce
- Props tipadas siempre con interface (no type alias para props de componentes)
- Exportar types que se usen en más de un archivo

### CSS
- Variables CSS definidas en `globals.css` — no hardcodear colores en componentes
- `var(--color-accent)` no `#059669` directamente en componentes
- Usar logical properties (`padding-inline-start`) donde el RTL pueda afectar

---

## 13. Skills Disponibles (Usar según contexto)

| Skill | Cuándo usarlo | Ruta |
|-------|--------------|------|
| `minimalist-ui` | Cualquier componente visual | `.opencode/skills/UXUI/skills/minimalist-skill/SKILL.md` |
| `design-taste-frontend` | Layout complejo, bento grids | `.opencode/skills/UXUI/skills/taste-skill/SKILL.md` |
| `high-end-visual-design` | Hero section, polish final | `.opencode/skills/UXUI/skills/soft-skill/SKILL.md` |
| `gsap-core` | Animaciones básicas gsap.to/from | `.opencode/skills/gsap-skills-main/skills/gsap-core/SKILL.md` |
| `gsap-timeline` | Secuencias (animación victoria) | `.opencode/skills/gsap-skills-main/skills/gsap-timeline/SKILL.md` |
| `gsap-performance` | Optimizar animaciones existentes | `.opencode/skills/gsap-skills-main/skills/gsap-performance/SKILL.md` |
| `full-output-enforcement` | Cuando el código es largo y completo | `.opencode/skills/UXUI/skills/output-skill/SKILL.md` |

---

## 14. Archivos Clave — Referencia Rápida

| Archivo | Propósito |
|---------|----------|
| `AGENTS.md` | **Este archivo** — leer primero siempre |
| `.specify/memory/constitution.md` | Principios del proyecto |
| `games_promts/train_tracks.md` | Especificación del juego Train Tracks |
| `src/games/registry.ts` | Registro de todos los juegos |
| `src/i18n/config.ts` | Configuración de idiomas |
| `src/styles/globals.css` | Variables CSS y paleta |
| `vite.config.ts` | Config Vite + PWA + Lingui |
| `lingui.config.ts` | Config i18n |

---

## 15. Flujo de Trabajo para Sesiones Futuras

Al iniciar una nueva sesión de OpenCode:

1. **Leer este archivo** completo
2. **Leer** `.specify/memory/constitution.md` para los principios
3. **Revisar** la sección "Estado Actual del Proyecto" (sección 2 de este archivo)
4. **Identificar** la fase activa según los TODOs pendientes
5. Si el usuario añadió un nuevo prompt en `/games_promts/`, leerlo antes de implementar ese juego
6. **Aplicar siempre** el skill `minimalist-ui` para cualquier trabajo visual
7. **Nunca construir** sin entender el contexto completo

---

*Documento generado el 2026-05-19. Actualizar la sección "Estado Actual" al completar cada fase.*
