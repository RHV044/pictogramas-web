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
import { IPictogram } from '../models/pictogram';

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function Seleccion(props: {
  pictogramas: IPictogram[];
  setPictogramas: (arg0: IPictogram[]) => void;
}) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  var i = 0;

  useEffect(() => {
    console.log('pictogramas Actualizados: ', props.pictogramas);
    setPictogramas(props.pictogramas);
  }, [props.pictogramas]);

  // useEffect(() => {
  //   console.log('pictogramas Actualizados: ', props.pictogramas)
  //   setPictogramas(props.pictogramas)
  // },[])

  return (
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
      >
        {pictogramas.map((pictograma: IPictogram) => {
          return (
            <Grid key={i++} item xs={12} sm={4} md={2}>
              <Container key={i++}>
                <Card
                  sx={{ maxWidth: 345 }}
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    let nuevaLista = pictogramas.filter(
                      (p: IPictogram) => p.id != pictograma.id
                    );
                    console.log(
                      'removiendo pictograma, van a quedar: ',
                      nuevaLista
                    );
                    props.setPictogramas(nuevaLista);
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        apiPictogramas +
                        '/pictogramas/' +
                        pictograma.id +
                        '/obtener'
                      }
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
