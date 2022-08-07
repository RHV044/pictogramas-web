import { Card, CardActionArea, CardContent, CardHeader, CardMedia } from '@mui/material'
import type { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'
import { Movimientos } from './movimientos'

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}

export interface BoxProps {
  name: string,
  onDrop: () => void,
  movimientos: Movimientos,
  fila,
  columna,
  esPictograma, 
  imagen
}

interface DropResult {
  name: string
}



export const Box: FC<BoxProps> = function Box({ name, onDrop, movimientos, fila, columna, esPictograma, imagen }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item && dropResult) {
        movimientos.moveGrafico(item.name)
        onDrop()
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1

  return (
    <div>
    { !esPictograma &&
      <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
        {name}
      </div>
    }
    { esPictograma &&
      <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
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
              src={`data:image/png;base64, ${imagen}`}
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
