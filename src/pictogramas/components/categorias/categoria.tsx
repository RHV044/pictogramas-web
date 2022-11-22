import { Height } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ICategoria } from '../../models/categoria';
import Typography from '@mui/material/Typography';

export default function Categoria(props: any) {
  const [categoria, setCategoria] = useState({} as ICategoria);
  const [categorias, setCategorias] = useState([] as ICategoria[]);

  useEffect(() => {
    setCategoria(props.categoria);
    setCategorias(props.categorias);
  }, []);
  return (
    <Card
      onClick={() => {}}>
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
        }}>
        <CardMedia
          component="img"
          src={`data:image/png;base64,${categoria.imagen}`}
          alt={categoria.nombre}
        ></CardMedia>
        <CardContent 
          style={{ paddingTop: 4, paddingLeft: 4}} >
          <Typography 
            sx = {{typography: { sm: 'body1', xs: 'body2' } }} 
            fontFamily="Arial"
            fontWeight="medium"
            color="#00A7E1" >
            {categoria.nombre ? categoria.nombre.toLocaleUpperCase() : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
