// Web Audio API sintetizador nativo para efectos de sonido retro de consola
// Sin peso de archivos, latencia cero, funciona 100% offline

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Sonido sutil al interactuar / pulsar celdas
export function playTick(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    // Frecuencia alta y corta para un "click" digital muy limpio
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05)

    // Decaimiento rápido de volumen
    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch {
    // Silencioso si la API no está soportada o bloqueada por el navegador
  }
}

// Sonido sutil al colocar una marca de bloqueo (X)
export function playBlock(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(350, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.04)
  } catch {}
}

// Melodía triunfal retro al ganar
export function playVictorySound(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const notes = [261.63, 329.63, 392.00, 523.25] // Arpegio Do Mayor (C4, E4, G4, C5)
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + index * 0.08)

      gain.gain.setValueAtTime(0.0, now + index * 0.08)
      gain.gain.linearRampToValueAtTime(0.08, now + index * 0.08 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + index * 0.08)
      osc.stop(now + index * 0.08 + 0.18)
    })
  } catch {}
}

// Acorde de inicialización de la consola al arrancar
export function playBootSound(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Acorde futurista: C4, G4, C5, E5 (ondas de triángulo con filtro analógico rápido)
    const notes = [261.63, 392.00, 523.25, 659.25]

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + index * 0.06)

      // Entrada suave y decaimiento lento
      gain.gain.setValueAtTime(0.0, now + index * 0.06)
      gain.gain.linearRampToValueAtTime(0.05, now + index * 0.06 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + index * 0.06)
      osc.stop(now + index * 0.06 + 0.4)
    })
  } catch {}
}

// Sonido de barrido de frecuencia (swoosh/ warp espacial de neón) al cargar juego
export function playSwooshSound(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    
    // Barrido de frecuencia ascendente rápido y masivo
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.55)

    // Ajuste de ganancia para una entrada y salida fluidas
    gain.gain.setValueAtTime(0.0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.55)
  } catch {}
}

// Sonido elegante al pedir una pista
export function playHintSound(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Acorde mágico brillante: E5, B5, E6
    const notes = [659.25, 987.77, 1318.51]

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + index * 0.04)

      gain.gain.setValueAtTime(0.0, now + index * 0.04)
      gain.gain.linearRampToValueAtTime(0.04, now + index * 0.04 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + index * 0.04)
      osc.stop(now + index * 0.04 + 0.4)
    })
  } catch {}
}

// Micro-clics analógicos rápidos (bips de datos de neón) para el efecto Scramble de escritura
export function playTypeSound(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    const freq = 1200 + Math.random() * 400
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(0.015, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.012)
  } catch {}
}

// Sonido sutil al seleccionar una isla
export function playSelect(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.06)
  } catch {}
}

// Sonido suave al deseleccionar una isla
export function playDeselect(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05)

    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch {}
}

// Sonido al colocar un puente nuevo
export function playBridgePlace(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.1)
  } catch {}
}

// Sonido al upgrade a puente doble
export function playBridgeUpgrade(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.05)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.1)
  } catch {}
}

// Sonido al borrar un puente
export function playBridgeRemove(): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(500, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.06)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.06)
  } catch {}
}
