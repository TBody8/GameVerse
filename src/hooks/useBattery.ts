import { useEffect, useState } from 'react'

interface BatteryState {
  level: string       // '85' si hay datos reales, '' si no
  isSupported: boolean
  isCharging: boolean | null
}

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    level: '',
    isSupported: false,
    isCharging: null,
  })

  useEffect(() => {
    let batteryInstance: any = null

    const updateBatteryInfo = (battery: any) => {
      setState({
        level: `${Math.round(battery.level * 100)}`,
        isSupported: true,
        isCharging: battery.charging ?? null,
      })
    }

    if ('getBattery' in navigator) {
      ;(navigator as any).getBattery().then((battery: any) => {
        batteryInstance = battery
        updateBatteryInfo(battery)

        battery.addEventListener('levelchange', () => updateBatteryInfo(battery))
        battery.addEventListener('chargingchange', () => updateBatteryInfo(battery))
      }).catch(() => {
        // API existe pero el navegador la bloqueó (política de privacidad)
        setState({ level: '', isSupported: false, isCharging: null })
      })
    }
    // Si no existe 'getBattery', el estado inicial ya refleja isSupported: false

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', () => updateBatteryInfo(batteryInstance))
        batteryInstance.removeEventListener('chargingchange', () => updateBatteryInfo(batteryInstance))
      }
    }
  }, [])

  return state
}
