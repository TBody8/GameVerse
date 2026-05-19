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
