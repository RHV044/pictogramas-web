import type { CSSProperties, FC } from 'react'
import { useMemo } from 'react'

import { Tabla } from './tabla'
import { Game } from './game'

export interface ChessboardTutorialAppState {
  knightPosition: [number, number]
}

const containerStyle: CSSProperties = {
  width: 500,
  height: 500,
  border: '1px solid gray',
}

/**
 * The Chessboard Tutorial Application
 */
export const Ejemplo: FC = () => {
  const game = useMemo(() => new Game(), [])

  return (
    <div style={containerStyle}>
      <Tabla game={game} />
    </div>
  )
}
