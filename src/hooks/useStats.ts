import { useState, useCallback, useEffect } from 'react'
import { getStats, saveStats, GlobalStats } from '@/utils/storage'

export function useStats() {
  const [stats, setStats] = useState<GlobalStats>(getStats())

  // Sincronizar stats en caso de que cambien en otra pestaña u otro componente
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameverse_stats') {
        setStats(getStats())
      }
    }
    // Para actualizaciones dentro de la misma pestaña usamos un evento custom
    const handleCustomChange = () => setStats(getStats())

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('gameverse-stats-updated', handleCustomChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('gameverse-stats-updated', handleCustomChange)
    }
  }, [])

  const recordWin = useCallback((gameId: string, difficulty: string, time: number) => {
    const currentStats = getStats()
    
    // Calcular Racha (Streak)
    const today = new Date().toDateString()
    let newStreak = currentStats.streak
    
    if (currentStats.lastPlayDate) {
      const lastDate = new Date(currentStats.lastPlayDate)
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
      
      if (diffDays === 1) {
        newStreak += 1
      } else if (diffDays > 1) {
        newStreak = 1 // Reset racha
      }
    } else {
      newStreak = 1
    }

    // Actualizar o crear objeto del juego
    const gameStat = currentStats.games[gameId] || { wins: 0, bestTime: {} }
    
    // Actualizar victoria y mejor tiempo
    const isBetterTime = !gameStat.bestTime[difficulty] || time < gameStat.bestTime[difficulty]
    const updatedGameStat = {
      ...gameStat,
      wins: gameStat.wins + 1,
      bestTime: {
        ...gameStat.bestTime,
        [difficulty]: isBetterTime ? time : gameStat.bestTime[difficulty]
      }
    }

    const updatedStats: GlobalStats = {
      ...currentStats,
      totalWins: currentStats.totalWins + 1,
      streak: newStreak,
      lastPlayDate: today,
      games: {
        ...currentStats.games,
        [gameId]: updatedGameStat
      }
    }

    saveStats(updatedStats)
    setStats(updatedStats)
    // Notificar a otros componentes
    window.dispatchEvent(new Event('gameverse-stats-updated'))
  }, [])

  return { stats, recordWin }
}
