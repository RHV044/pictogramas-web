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
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerPictogramasConImagenes, PictogramaNoSeDebeTraducir, TraducirKeyword,
} from '../pictogramas/services/pictogramas-services';

export default function PictogramasMasUtilizados(props: any) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);

  useEffect(() => {
    ObtenerPictogramasConImagenes(props.pictogramas).then((picts) => {
      setPictogramas(picts);
    });
  }, []);

  return (
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
      >
        {pictogramas.map((pictograma) => {
          return (
            <Grid
              key={pictograma.id ? pictograma.id : pictograma.identificador}
              item
              xs={12}
              sm={4}
              md={2}
            >
              <Container
                key={pictograma.id ? pictograma.id : pictograma.identificador}
              >
                <Card
                  sx={{
                    maxWidth: 250,
                    minWidth: 160,
                    maxHeight: 250,
                    minHeight: 75,
                  }}
                  style={{ marginTop: '10px', paddingLeft: 5, paddingRight: 5, paddingBottom: 20  }}
                  onClick={() => {}}
                >
                  <CardActionArea
                    onClick={() => {
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      width="140"
                      src={
                        pictograma.imagen &&
                        pictograma.imagen.includes('data:image')
                          ? pictograma.imagen
                          : `data:image/png;base64,${pictograma.imagen}`
                      }
                      alt={TraducirKeyword(pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase())}
                    ></CardMedia>
                    <CardHeader
                      style={{
                        height: '100%',
                        width: '95%',
                        marginBottom: 1,
                        paddingBottom: 0,
                      }}
                    ></CardHeader>
                    <CardContent
                      style={{
                        marginTop: 1,
                        paddingTop: 0,
                        marginLeft: 4,
                        paddingLeft: 0,
                        fontWeight: 'bold',
                        paddingBottom: 0,
                      }}
                    >
                      {TraducirKeyword(pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase())}
                    </CardContent>
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
