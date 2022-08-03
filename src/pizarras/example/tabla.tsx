import type { CSSProperties, FC } from 'react'
import { useEffect, useState } from 'react'

import { CeldaTabla } from './celdaTabla'
import type { Game, Position } from './game'
import { Piece } from './piece'

export interface TablaProps {
  game: Game
}

/** Styling properties applied to the board element */
const boardStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
}
/** Styling properties applied to each square element */
const squareStyle: CSSProperties = { width: '12.5%', height: '12.5%' }

/**
 * The chessboard component
 * @param props The react props
 */
export const Tabla: FC<TablaProps> = ({ game }) => {
  const [[knightX, knightY], setKnightPos] = useState<Position>(
    game.knightPosition,
  )
  useEffect(() => game.observe(setKnightPos))

  function renderSquare(i: number) {
    const x = i % 8
    const y = Math.floor(i / 8)

    return (
      <div key={i} style={squareStyle}>
        <CeldaTabla x={x} y={y} game={game}>
          <Piece isKnight={x === knightX && y === knightY} />
        </CeldaTabla>
      </div>
    )
  }

  const squares = [] as JSX.Element[]
  for (let i = 0; i < 64; i += 1) {
    squares.push(renderSquare(i))
  }
  return <div style={boardStyle}>{squares}</div>
}
