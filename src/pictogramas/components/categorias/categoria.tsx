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
      sx={{ maxWidth: 245, minWidth:150 }}
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
          height="140"
          image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
          alt="MESSI"
        ></CardMedia>
        <CardHeader title={categoria.nombre}></CardHeader>
        <CardContent></CardContent>
      </CardActionArea>
    </Card>
  )
}