import { useEffect } from 'react'
import { gsap } from 'gsap'
import { type Position } from '../logic/types'

interface UseTrainAnimationProps {
  isVictory: boolean
  solution: Position[]
  onComplete: () => void
}

export function useTrainAnimation({
  isVictory,
  solution,
  onComplete,
}: UseTrainAnimationProps) {
  useEffect(() => {
    if (!isVictory || solution.length === 0) return

    const train = document.getElementById('victory-train')
    if (!train) {
      onComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete,
    })

    // Asegurarse de que el tren empiece invisible y colocado
    // En Cyber-Arcade, el tren es una estela de energía brillante
    tl.set(train, { opacity: 0.9, scale: 1, filter: 'drop-shadow(0 0 8px var(--color-accent-hover))' })

    // Animación del tren recorriendo el camino
    solution.forEach((pos, index) => {
      const targetX = pos.col * 100 + 50
      const targetY = pos.row * 100 + 50

      if (index === 0) {
        tl.set(train, { x: targetX, y: targetY })
      } else {
        const prevPos = solution[index - 1]
        let rotation = 0
        if (pos.col > prevPos.col) rotation = 0
        if (pos.col < prevPos.col) rotation = 180
        if (pos.row > prevPos.row) rotation = 90
        if (pos.row < prevPos.row) rotation = 270

        tl.to(train, {
          x: targetX,
          y: targetY,
          rotation,
          duration: 0.18, // Movimiento ultra rápido de energía cyber
          ease: 'sine.inInOut',
        })
      }
    })

    // Desvanecer el tren con un destello
    tl.to(train, {
      scale: 1.4,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out',
    })
  }, [isVictory, solution, onComplete])
}
