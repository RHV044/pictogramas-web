import { CSSProperties, FC, useEffect, useLayoutEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { memo } from 'react'
import { Grafico, Movimientos } from './movimientos'
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
  const [graficos, setGraficos] = useState([] as Grafico[])
  const [graficosSinLugar, setGraficosSinLugar] = useState([] as Grafico[])
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'box',
    canDrop: (monitor) => {
      return !movimientos.hayAlgo(fila, columna)
    },
    drop: (monitor) => {
      movimientos.moveElement(fila, columna)
      let grafs = movimientos.getGraficos()
      setGraficos([...grafs])
      onDrop()
    },    
    collect: (monitor) => ({      
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  useLayoutEffect(()=> {
    handleChange()
  },)

  useEffect(()=>{
    let grafs = [...graficos]
    setGraficosSinLugar(grafs)
  },[graficos])

  const handleChange = () => { 
      let graf = movimientos.getGraficos()
      setGraficos(graf);              
      if(!compararListas(graficos, graficosSinLugar)){
        let grafs = [...graficos]
        setGraficosSinLugar(grafs)
        console.log('Graficos actualizados: ', graficosSinLugar)  
      }  
  }

  const compararListas = (array1: Grafico[], array2: Grafico[]) => {
    if (array1.length !== array2.length) return false;
  
    for (var i = 0; i < array2.length; i++) {
      if (array1.some(g => g.identificacion === array2[i].identificacion && 
        (g.posicion.columna !== array2[i].posicion.columna || g.posicion.fila !== array2[i].posicion.fila))){
          return false
        }
    }
    return true;
  };

  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }

  return (
    <div>
      { (graficosSinLugar.length === 0 ||  !graficosSinLugar.some(g => g.posicion.columna === columna && g.posicion.fila === fila)) && 
        <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
          {isActive ? 'Release to drop' : 'Drag a box here'}
        </div>
      }
      { (graficosSinLugar.length > 0 && graficosSinLugar.some(g => g.posicion.columna === columna && g.posicion.fila === fila)) && 
        graficosSinLugar.filter(g => g.posicion.columna === columna && g.posicion.fila === fila).map(grafico => {
          if(grafico.esPictograma === false)
            return(<Box name={grafico.texto} key={grafico.identificacion} movimientos={movimientos} identificacion={grafico.identificacion} 
              fila={fila} columna={columna} esPictograma={false} imagen={''} onDrop={() => { handleChange(); onDrop();}}/>)
          else
            return(<Box name={grafico.texto} key={grafico.texto} movimientos={movimientos} identificacion={grafico.identificacion} 
              fila={fila} columna={columna} esPictograma={true} imagen={grafico.imagen} onDrop={() => {handleChange(); onDrop(); }}/>)
        })
      }     
    </div>
  )
})
