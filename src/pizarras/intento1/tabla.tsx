import type { CSSProperties, FC } from 'react'
import { useEffect, useState } from 'react'

import { CeldaTabla } from './celdaTabla'

export interface TablaProps {
  filas: number
  columnas: number
}

/** Styling properties applied to the board element */
const boardStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
}
/** Styling properties applied to each square element */

/**
 * The chessboard component
 * @param props The react props
 */
export const Tabla: FC<TablaProps> = ({ filas, columnas }) => {

  function rendercelda(f: number, c: number) {
    console.log('Fila: ', f)
    console.log('Columna: ', c)
    console.log('Porcentaje de ocupacion de celda: ', 100/(f*c))
    const width= '12.5%'
    const height= '12.5%'
    return (
      // <div key={f + '' + c} style={{width: 100/(f*c) + '%', height: 100/(f*c) + '%'}}>
      <div key={f + '' + c} style={{width: width + '%', height: height}}>
        <CeldaTabla x={f} y={c}>
        </CeldaTabla>
      </div>
    )
  }

  const squares = [] as JSX.Element[]
  for (let f = 0; f < filas; f += 1) {
    for(let c=0; c < columnas; c += 1){
      squares.push(rendercelda(f,c))
    }
  }
  return <div style={boardStyle}>{squares}</div>
}
