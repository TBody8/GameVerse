export interface GameMetadata {
  id: string
  nameKey: string
  descriptionKey: string
  difficulties: ('easy' | 'medium' | 'hard' | 'expert')[]
  component: React.LazyExoticComponent<React.ComponentType<any>>
  iconName: string
  available: boolean
}

import React from 'react'

export const gameRegistry: Record<string, GameMetadata> = {
  'train-tracks': {
    id: 'train-tracks',
    nameKey: 'Train Tracks',
    descriptionKey: 'Dibuja una vía de tren continua de A a B respetando los límites de cada fila y columna.',
    difficulties: ['easy', 'medium', 'hard', 'expert'],
    component: React.lazy(() => import('./train-tracks/TrainTracks')),
    iconName: 'Train',
    available: true,
  },
}
