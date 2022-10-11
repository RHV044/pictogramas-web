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
      sx={{ maxWidth: 230, minWidth:70, maxHeight: 240, minHeight: 50 }}
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
          alt={categoria.nombre}
        ></CardMedia>
        <CardHeader 
          style={{
            height: '100%',
            width: '95%',
            marginBottom: 1,
            paddingBottom: 0
          }} 
          >          
        </CardHeader>
        <CardContent 
          style={{
            marginTop: 1,
            paddingTop: 0,
            marginLeft: 4,
            paddingLeft: 0,
            fontWeight: 'bold'
          }}
        >
          {categoria.nombre}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}