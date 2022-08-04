import type { CSSProperties, FC } from 'react'
import { useDrop } from 'react-dnd'
import { memo } from 'react'
import { Movimientos } from './movimientos'

const style: CSSProperties = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

export interface CellDropProps {
  onDrop: (item: any) => void,
  name: string,
  fila: number,
  columna: number,
  movimientos: Movimientos
}

export const CellDrop: FC<CellDropProps> = memo(function CellDrop({
  onDrop,
  name,
  movimientos,
  fila,
  columna
}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'box',
    drop: () => movimientos.moveElement(fila, columna),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </div>
  )
})
