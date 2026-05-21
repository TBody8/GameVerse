export const STATS_STORAGE_KEY = 'gameverse_stats'
export const PROGRESS_STORAGE_KEY = 'gameverse_progress' // Existing maybe, but let's just do stats here.

export interface GameStat {
  wins: number
  bestTime: Record<string, number> // Record<difficulty, time in seconds>
}

export interface GlobalStats {
  totalWins: number
  streak: number
  lastPlayDate: string | null
  games: Record<string, GameStat>
}

const defaultStats: GlobalStats = {
  totalWins: 0,
  streak: 0,
  lastPlayDate: null,
  games: {},
}

export function getStats(): GlobalStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY)
    if (!raw) return defaultStats
    return JSON.parse(raw) as GlobalStats
  } catch {
    return defaultStats
  }
}

export function saveStats(stats: GlobalStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — silent fail
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
