import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IPictogram } from '../models/pictogram';
import { ObtenerPictogramasPorCategoria } from '../services/pictogramas-services';

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function PictogramasPorCategoria(props: any) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);

  useEffect(() => {
    ObtenerPictogramasPorCategoria(setPictogramas, props.categoria);
  }, []);

  return (
    <Container>
      <Grid container>
        {pictogramas.map((pictograma) => {
          return (
            //Como estan dentro de la categoria, se visualizan abajo, habria que extraerlo a otro lugar
            <Grid key={pictograma.id} item xs={12} sm={12} md={12}>
              <Container key={pictograma.id}>
                <Card
                  sx={{ maxWidth: 345 }}
                  style={{ marginTop: '10px' }}
                  onClick={() => {}}
                >
                  <CardActionArea
                    onClick={() => {
                      let pictogramasSeleccionados = props.pictogramas;
                      pictogramasSeleccionados.push(pictograma);
                      props.setPictogramas(pictogramasSeleccionados);
                      console.log(
                        'se agrego un pictograma: ',
                        props.pictogramas
                      );
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      //image={apiPictogramas+'/pictogramas/'+pictograma.id+'/obtener'}
                      //image={pictograma.imagen}
                      //TODO: Optimizar o ver alternativa para levantar los base64
                      src={`data:image/png;base64, ${pictograma.imagen}`}
                      alt={pictograma.keywords[0].keyword}
                    ></CardMedia>
                    <CardHeader
                      title={pictograma.keywords[0].keyword}
                    ></CardHeader>
                    <CardContent></CardContent>
                  </CardActionArea>
                </Card>
              </Container>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
