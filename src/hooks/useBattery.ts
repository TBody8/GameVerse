import { useEffect, useState } from 'react'

export function useBattery() {
  const [level, setLevel] = useState<string>('∞')

  useEffect(() => {
    let batteryInstance: any = null

    const updateBatteryInfo = (battery: any) => {
      const percentage = Math.round(battery.level * 100)
      setLevel(`${percentage}`)
    }

    if ('getBattery' in navigator) {
      ;(navigator as any).getBattery().then((battery: any) => {
        batteryInstance = battery
        updateBatteryInfo(battery)

        battery.addEventListener('levelchange', () => updateBatteryInfo(battery))
      }).catch(() => {
        // En caso de error o bloqueo de seguridad, fallback a infinito
        setLevel('∞')
      })
    } else {
      setLevel('∞')
    }

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', () => updateBatteryInfo(batteryInstance))
      }
    }
  }, [])

  return level
}
