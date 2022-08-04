import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'
import { Celda } from './celda'

export interface CeldaTablaProps {
  x: number
  y: number
  children?: ReactNode
}

export const CeldaTabla: FC<CeldaTablaProps> = ({
  x,
  y,
  children,
}: CeldaTablaProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: '',
      canDrop: () => true,
      drop: () => true,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
  )

  return (
    <div
      ref={drop}
      role="Space"
      data-testid={`(${x},${y})`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        border: 'solid'
      }}
    >
      <Celda>{children}</Celda>
    </div>
  )
}
