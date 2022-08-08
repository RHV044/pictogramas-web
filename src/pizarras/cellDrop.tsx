import type { CSSProperties, FC } from 'react'
import { useDrop } from 'react-dnd'
import { memo } from 'react'
import { Movimientos } from './movimientos'
import { Box } from './draggableBox'

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
  borderStyle: 'solid', 
  borderWidth: 2.5,
  borderColor: 'black'
}

export interface CellDropProps {
  onDrop: () => void,
  name: string,
  fila: number,
  columna: number,
  movimientos: Movimientos
}

interface DropResult {
  name: string
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
    canDrop: (monitor) => {
      //const dropResult = monitor.getDropResult<DropResult>()
      return !movimientos.hayAlgo(fila, columna)
    },
    drop: (monitor) => {
      //const dropResult = monitor.getDropResult<DropResult>()
      console.log('CellDrop - Drop - Texto: ' + name + ' Fila: ' + fila + ' Columna:' + columna)
      movimientos.moveElement(fila, columna)
      onDrop()
    },    
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
    <div>
      { (movimientos.getGraficos().length === 0 ||  !movimientos.getGraficos().some(g => g.posicion.columna === columna && g.posicion.fila === fila)) && 
        <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
          {isActive ? 'Release to drop' : 'Drag a box here'}
        </div>
      }
      { (movimientos.getGraficos().length > 0 && movimientos.getGraficos().some(g => g.posicion.columna === columna && g.posicion.fila === fila)) && 
        movimientos.getGraficos().filter(g => g.posicion.columna === columna && g.posicion.fila === fila).map(grafico => {
            // <div key={grafico.texto}>  {/*style={style}*/}
            //    { grafico.texto } 
            // </div>
          if(grafico.esPictograma === false)
            return(<Box name={grafico.texto} key={grafico.identificacion} movimientos={movimientos} identificacion={grafico.identificacion} 
              fila={fila} columna={columna} esPictograma={false} imagen={''} onDrop={() => { }}/>)
          else
            return(<Box name={grafico.texto} key={grafico.texto} movimientos={movimientos} identificacion={grafico.identificacion} 
              fila={fila} columna={columna} esPictograma={true} imagen={grafico.imagen} onDrop={() => { }}/>)
        })
      }     
    </div>
  )
})
