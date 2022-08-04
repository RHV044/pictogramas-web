import type { CSSProperties, FC } from 'react'
import { DragPreviewImage, useDrag } from 'react-dnd'


const textStyle: CSSProperties = {
  fontSize: 40,
  fontWeight: 'bold',
  cursor: 'move',
}

export interface GraficoProps {
  texto: string
}

export const Grafico: FC<GraficoProps> = ({
  texto
}: GraficoProps) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'texto',
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  )

  return (
    <>
      <div
        ref={drag}
        style={{
          ...textStyle,
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {texto}
      </div>
    </>
  )
}
