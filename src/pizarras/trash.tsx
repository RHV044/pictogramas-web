import Delete from '@mui/icons-material/Delete'
import { CSSProperties, FC, memo } from 'react'
import { useDrop } from 'react-dnd'
import { DragItem } from './interfaces'
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

export interface TrashDrops {
  onDrop: (item: any) => void,
  name: string,
  movimientos: Movimientos
}

export const Trash: FC<TrashDrops> = memo(function CellDrop({
  onDrop,
  name,
  movimientos
}) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'box',
    drop(_item: DragItem, monitor) { 
      movimientos.eliminarGrafico(_item.identificacion)
      return undefined
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = canDrop && isOver
  let backgroundColor = 'white'
  if (isActive) {
    backgroundColor = 'grey'
  } else if (canDrop) {
    backgroundColor = 'grey'
  }

  return (    
    <div ref={drop} style={{ backgroundColor, width: 75, height: 75 }} data-testid="dustbin">
      <Delete style={{width:60, height:60}}>
        {isActive ? 'Soltar para eliminar' : 'Arrastra un elemento aqui para eliminarlo'}
      </Delete>
    </div>
  )
})
