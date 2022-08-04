import type { FC, ReactNode } from 'react'

export interface SquareProps {
  children?: ReactNode
}

const squareStyle = {
  width: '100%',
  height: '100%',
}

export const Celda: FC<SquareProps> = ({ children }) => {
  const backgroundColor = 'white'
  const color = 'white' 
  return (
    <div
      style={{
        ...squareStyle,
        color,
        backgroundColor,
        border: 'solid'
      }}
    >
      {children}
    </div>
  )
}
