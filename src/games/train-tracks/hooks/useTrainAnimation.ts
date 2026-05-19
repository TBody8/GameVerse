import { useEffect } from 'react'
import { gsap } from 'gsap'
import { type Position } from '../logic/types'

interface UseTrainAnimationProps {
  isVictory: boolean
  solution: Position[]
  gridSize: number
  onComplete: () => void
}

export function useTrainAnimation({
  isVictory,
  solution,
  onComplete,
}: Omit<UseTrainAnimationProps, 'gridSize'>) {
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
    tl.set(train, { opacity: 1, scale: 1 })

    // Animación del tren recorriendo el camino
    solution.forEach((pos, index) => {
      // Cada celda mide 100 unidades en el SVG del tablero
      // Centro de la celda es: x = col * 100 + 50, y = row * 100 + 50
      const targetX = pos.col * 100 + 50
      const targetY = pos.row * 100 + 50

      if (index === 0) {
        tl.set(train, { x: targetX, y: targetY })
      } else {
        const prevPos = solution[index - 1]
        // Calcular ángulo de rotación para que mire al frente del movimiento
        let rotation = 0
        if (pos.col > prevPos.col) rotation = 0 // derecha
        if (pos.col < prevPos.col) rotation = 180 // izquierda
        if (pos.row > prevPos.row) rotation = 90 // abajo
        if (pos.row < prevPos.row) rotation = 270 // arriba

        tl.to(train, {
          x: targetX,
          y: targetY,
          rotation,
          duration: 0.25,
          ease: 'power1.inOut',
        })
      }
    })

    // Desvanecer el tren
    tl.to(train, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [isVictory, solution, onComplete])
}
