import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { ICategoria } from '../models/categoria';
import { ObtenerCategorias } from '../services/pictogramas-services';
import PictogramasPorCategoria from './pictogramasPorCategoria';

const Categorias = (props: any) => {

  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({} as ICategoria|null)

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  return (
    <Container>
      <Grid container>
      {categorias.map((categoria) => {
        return (
          <Grid key={categoria.id + '-' + categoria.nombre}        
            item xs={4} sm={6} md={4}> 
          <Container key={categoria.id + '-' + categoria.nombre}>
            <Card
              sx={{ maxWidth: 345 }}
              style={{ marginTop: '10px' }}
              onClick={() => {
                //EXPANDIR CATEGORIA
              }}
            >
              <CardActionArea
                onClick={() => {
                  console.log('Clickearon una categoria: ', categoria.id)
                  if (categoriaSeleccionada == null || categoriaSeleccionada !== categoria)
                    setCategoriaSeleccionada(categoria)
                  else
                    setCategoriaSeleccionada(null)
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
            {categoria === categoriaSeleccionada && <PictogramasPorCategoria categoria={categoriaSeleccionada.id} setPictogramas={props.setPictogramas} pictogramas={props.pictogramas}>
            </PictogramasPorCategoria> }
          </Container>
          </ Grid>
        );
      })}
      </Grid>
    </Container>
  );
};

export default Categorias;
