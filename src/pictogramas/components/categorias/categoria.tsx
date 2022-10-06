import { Height } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, CardHeader, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";
import { ICategoria } from "../../models/categoria";


export default function Categoria(props: any) {
  const [categoria, setCategoria] = useState({} as ICategoria)
  const [categorias, setCategorias] = useState([] as ICategoria[])

  useEffect(() => {
    setCategoria(props.categoria)
    setCategorias(props.categorias)
  },[])
  return(           
    <Card
      sx={{ maxWidth: 230, minWidth:70 }}
      style={{ marginTop: '10px' }}
      onClick={() => {}}
    >
      <CardActionArea
        onClick={() => {
          console.log('Clickearon una categoria: ', categoria.id);
          if (
            props.categoriaSeleccionada == null ||
            props.categoriaSeleccionada !== categoria
          ) {
            props.setCategoriaSeleccionada(categoria);
          } else {
            props.setCategoriaSeleccionada(null);
          }
        }}
      >
        <CardMedia
          component="img"
          height="160"
          width="140"
          src={`data:image/png;base64,${categoria.imagen}`}
          alt="MESSI"
        ></CardMedia>
        <CardHeader 
          style={{
            height: '100%',
            marginBottom: 1,
            paddingBottom: 0
          }} 
          title={categoria.nombre}>            
        </CardHeader>
        <CardContent></CardContent>
      </CardActionArea>
    </Card>
  )
}