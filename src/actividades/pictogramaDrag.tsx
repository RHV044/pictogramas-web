import { Card, CardActionArea, CardContent, CardHeader, CardMedia } from '@mui/material'
import type { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'
import { IPictogram } from '../pictogramas/models/pictogram'
import { Reglas } from './reglas'

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}

export interface PictogramaDragProps {
  pictograma: IPictogram,
  onDrop: () => void,
  reglas: Reglas,
}

interface DropResult {
  name: string,
  identificacion: string
}

export const PictogramaDrag: FC<PictogramaDragProps> = function Box({ pictograma, onDrop, reglas }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { pictograma },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1

  return (
    <div>
      <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
        {pictograma.keywords[0].keyword}
      </div>
    </div>
  )
}
