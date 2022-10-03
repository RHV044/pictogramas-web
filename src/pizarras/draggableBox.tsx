import { Card, CardActionArea, CardContent, CardHeader, CardMedia } from '@mui/material'
import { CSSProperties, FC, useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Movimientos } from './movimientos'

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left'
}

export interface BoxProps {
  name: string,
  identificacion: string,
  onDrop: () => void,
  movimientos: Movimientos,
  fila,
  columna,
  esPictograma, 
  imagen: string
}

interface DropResult {
  name: string,
  identificacion: string
}



export const Box: FC<BoxProps> = function Box({ name, identificacion, onDrop, movimientos, fila, columna, esPictograma, imagen }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { name, identificacion },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item && dropResult) {
        movimientos.moveGrafico(item.identificacion)
        onDrop()
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const [actualizar, setActualizar] = useState(true)
  const opacity = isDragging ? 0.4 : 1

  return (
    <div>
    { !esPictograma &&
      <div ref={drag} style={{ ...style, opacity, transform: `translate(${10}px, ${10}px)`, WebkitTransform: 'translate(${10}px, ${10}px)' }} data-testid={`box`}>
        {name}
      </div>
    }
    { esPictograma &&
      <div ref={drag} style={{ ...style, opacity, transform: `translate(${10}px, ${10}px)`, WebkitTransform: 'translate(${10}px, ${10}px)' }} data-testid={`box`}>
        <Card
          sx={{ maxWidth: 245, minWidth:150 }}
          style={{ marginTop: '10px' }}
          onClick={() => {}}
        >
          <CardActionArea
            onClick={() => {
            }}
          >
            <CardMedia
              component="img"
              height="140"
              src={imagen.includes('data:image') ? imagen : `data:image/png;base64,${imagen}`}
              alt={name}
            ></CardMedia>
            <CardHeader
              title={name}
            ></CardHeader>
            <CardContent></CardContent>
          </CardActionArea>
        </Card>
      </div>
    }
    </div>
  )
}
