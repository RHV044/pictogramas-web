import { CSSProperties, FC, useEffect, useLayoutEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { memo } from 'react'
import { Reglas } from './reglas'

export const cellDropStyle: CSSProperties = {
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
  borderStyle: 'solid', 
  borderWidth: 2.5,
  borderColor: 'black'
}

export interface CategoriaDrop {
  onDrop: () => void,
  name: string,
  reglas: Reglas
}

interface DropResult {
  name: string
}

export const CategoriaDrop: FC<CategoriaDrop> = memo(function CellDrop({
  onDrop,
  name,
  reglas
}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'box',
    canDrop: (monitor) => {
      return true
    },
    drop: (monitor) => {

    },    
    collect: (monitor) => ({      
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const handleChange = () => { 
  }

  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }

  return (
    <div>
      <div ref={drop} style={{ ...cellDropStyle, backgroundColor }} data-testid="dustbin">
          {isActive ? 'Release to drop' : 'Drag a box here'}
        </div>
    </div>
  )
})
