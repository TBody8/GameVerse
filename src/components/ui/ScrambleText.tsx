import { useEffect, useState } from 'react'

interface ScrambleTextProps {
  text: string
  duration?: number // duración en ms
  delay?: number // retraso en ms
  className?: string
  style?: React.CSSProperties
}

const CHARS = 'Ø▲█▓▒░×⚡#$@%&?='

export default function ScrambleText({ text, duration = 900, delay = 100, className, style }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let frameId: number
    
    const startScramble = () => {
      const startTime = performance.now()
      
      const update = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Progreso escalonado de izquierda a derecha
        const revealIndex = Math.floor(progress * text.length)
        
        let current = ''
        for (let i = 0; i < text.length; i++) {
          if (i < revealIndex) {
            // Revelar el caracter real
            current += text[i]
          } else if (text[i] === ' ') {
            current += ' '
          } else {
            // Caracter aleatorio de matriz
            current += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }
        
        setDisplayText(current)
        
        if (progress < 1) {
          frameId = requestAnimationFrame(update)
        } else {
          setDisplayText(text)
        }
      }
      
      frameId = requestAnimationFrame(update)
    }

    timeoutId = setTimeout(() => {
      startScramble()
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(frameId)
    }
  }, [text, duration, delay])

  return (
    <span className={className} style={style}>
      {displayText}
    </span>
  )
}
