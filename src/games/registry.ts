import React from 'react'
import { type Difficulty } from '@/types/game'
import { msg } from '@lingui/macro'
import type { MessageDescriptor } from '@lingui/core'

export interface GameMetadata {
  id: string
  nameKey: MessageDescriptor
  descriptionKey: MessageDescriptor
  difficulties: Difficulty[]
  component: React.LazyExoticComponent<React.ComponentType<any>>
  iconName: string
  available: boolean
}

// Componente genérico de "Próximamente" para juegos no implementados aún.
// GamePage ya bloquea el acceso si `available === false`, pero este placeholder
// evita que React.lazy() resuelva a `null`, lo que causaría una pantalla en blanco
// si se accediera directamente a la ruta.
function ComingSoonComponent() {
  return React.createElement(
    'div',
    {
      style: {
        display: 'flex' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontSize: 'var(--text-lg)',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-mono)',
      },
    },
    '[ PRÓXIMAMENTE ]'
  )
}

const ComingSoon = React.lazy(
  (): Promise<{ default: React.ComponentType<any> }> =>
    Promise.resolve({ default: ComingSoonComponent })
)

export const gameRegistry: Record<string, GameMetadata> = {
  'train-tracks': {
    id: 'train-tracks',
    nameKey: msg({ id: 'Train Tracks', message: 'Train Tracks' }),
    descriptionKey: msg`Dibuja una vía de tren continua de A a B respetando los límites de cada fila y columna.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: React.lazy(() => import('./train-tracks/TrainTracks')),
    iconName: 'Train',
    available: true,
  },
  'battleships': {
    id: 'battleships',
    nameKey: msg`Battleships`,
    descriptionKey: msg`Encuentra la flota de barcos escondida en el océano usando pistas numéricas.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: React.lazy(() => import('./battleships/Battleships')),
    iconName: 'Anchor',
    available: true,
  },
  'bridges': {
    id: 'bridges',
    nameKey: msg`Bridges`,
    descriptionKey: msg`Conecta todas las islas con puentes sin que se crucen para formar una red.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: React.lazy(() => import('./bridges/Bridges')),
    iconName: 'ShareNetwork',
    available: true,
  },
  'kakuro': {
    id: 'kakuro',
    nameKey: msg`Kakuro`,
    descriptionKey: msg`Crucigrama matemático: rellena con números sin repetir para sumar las pistas.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: React.lazy(() => import('./kakuro/Kakuro')),
    iconName: 'GridNine',
    available: true,
  },
  'slitherlink': {
    id: 'slitherlink',
    nameKey: msg`Slitherlink`,
    descriptionKey: msg`Dibuja un único lazo cerrado conectando los puntos según los números dados.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: React.lazy(() => import('./slitherlink/Slitherlink')),
    iconName: 'BoundingBox',
    available: false,
  },
  'sudoku': {
    id: 'sudoku',
    nameKey: msg`Sudoku`,
    descriptionKey: msg`Completa la cuadrícula con números sin repetirlos en filas, columnas o cajas.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: ComingSoon,
    iconName: 'GridFour',
    available: false,
  },
  'minesweeper': {
    id: 'minesweeper',
    nameKey: msg`Buscaminas`,
    descriptionKey: msg`Despeja el campo de minas utilizando las pistas numéricas de peligro.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: ComingSoon,
    iconName: 'Bomb',
    available: false,
  },
  'nonogram': {
    id: 'nonogram',
    nameKey: msg`Nonogramas`,
    descriptionKey: msg`Revela la imagen oculta coloreando las celdas según los números del borde.`,
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: ComingSoon,
    iconName: 'ImageSquare',
    available: false,
  },
}
