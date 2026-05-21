# GameVerse

> Puzzle and logic games. Play anywhere, no signup, no install required.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Offline-Ready-059669?style=for-the-badge" alt="Offline Ready" />
  <img src="https://img.shields.io/badge/i18n-7_Languages-FF6F00?style=for-the-badge" alt="7 Languages" />
</p>

<p align="center">
  <strong>A curated collection of classic logic puzzles — accessible from any browser, works offline, zero ads, zero accounts. Just play.</strong>
</p>

---

## What is GameVerse

GameVerse is a progressive web app (PWA) built for people who want to pass the time on a train, plane, or waiting room. It offers a growing collection of classic logic puzzles and brain teasers, all playable directly in the browser.

**Philosophy**: Minimalist premium design. No ads. No accounts. Open and play.

## Games

### Available Now

| Game | Difficulty | Description |
|------|:----------:|-------------|
| **Train Tracks** | 4 levels | Draw a continuous train track from A to B respecting row/column limits |
| **Battleships** | 4 levels | Find the hidden fleet in the ocean using numeric clues |
| **Bridges** (Hashi) | 4 levels | Connect all islands with bridges without crossings to form a single network |

### In Progress

| Game | Status | Description |
|------|--------|-------------|
| **Kakuro** | 🔧 WIP | Mathematical crossword: fill numbers without repeating to match sum clues |
| **Slitherlink** | 🔧 WIP | Draw a single closed loop connecting dots according to given numbers |

### Coming Soon

| Game | Description |
|------|-------------|
| **Sudoku** | Fill the grid with numbers without repeating in rows, columns, or boxes |
| **Minesweeper** | Clear the minefield using numeric danger clues |
| **Nonograms** | Reveal hidden pictures by coloring cells based on edge numbers |

## Features

- **PWA** — Installable on any device, works fully offline
- **7 Languages** — Spanish, English, French, Portuguese, Chinese, Hindi, Arabic (RTL)
- **4 Difficulty Levels** — Easy, Medium, Hard, Expert
- **Zero friction** — No signup, no login, no ads
- **Premium UI** — Clean minimalist design with subtle GSAP animations
- **SVG Boards** — All game boards render as crisp native SVG
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 18 + Vite 6 |
| Language | TypeScript 5 (strict mode) |
| Routing | wouter v3 (~1.4KB gzip) |
| i18n | LinguiJS (build-time compilation) |
| Animations | GSAP v3 |
| Game Boards | Native SVG |
| PWA | vite-plugin-pwa (generateSW) |
| Icons | @phosphor-icons/react |
| Fonts | Geist Sans + Geist Mono |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or higher
- npm (comes with Node.js)

### Development

```bash
# Install dependencies
npm install

# Start dev server (available on your local network)
npm run dev

# Extract i18n strings
npm run i18n:extract

# Compile i18n catalogs
npm run i18n:compile
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

## Docker

GameVerse includes a multi-stage Dockerfile that builds the app with Node.js and serves it with Nginx.

```bash
# Build the image
docker build -t gameverse .

# Run the container
docker run -d -p 80:80 gameverse
```

The app will be available at `http://localhost`.

### Docker Compose (optional)

```yaml
services:
  gameverse:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

## Deploy to VPS

1. Push your changes to this repository
2. Clone on your VPS: `git clone https://github.com/TBody8/GameVerse.git`
3. Build and run with Docker:

```bash
cd GameVerse
docker build -t gameverse .
docker run -d -p 80:80 --name gameverse --restart unless-stopped gameverse
```

## Project Structure

```
GameVerse/
├── Dockerfile              # Multi-stage build (Node → Nginx)
├── nginx.conf              # Nginx config with SPA routing
├── src/
│   ├── games/              # Game modules (self-contained)
│   │   ├── registry.ts     # Central game registry
│   │   ├── train-tracks/
│   │   ├── battleships/
│   │   ├── bridges/
│   │   ├── kakuro/
│   │   └── slitherlink/
│   ├── components/         # Shared UI components
│   ├── pages/              # HomePage, GamePage
│   ├── i18n/               # LinguiJS locales (7 languages)
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # CSS variables, theme, RTL
│   └── utils/              # Utilities
│   └── types/              # Shared TypeScript types
├── public/                 # Static assets (favicon, PWA icons)
└── games_promts/           # Game specification prompts
```

## Contributing

Contributions are welcome! To add a new game:

1. Create a specification in `games_promts/<game-name>.md`
2. Create the game module in `src/games/<game-name>/`
3. Register it in `src/games/registry.ts`
4. Add translations to all locale files in `src/i18n/locales/`

See `AGENTS.md` for detailed project conventions.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with by TBody8
