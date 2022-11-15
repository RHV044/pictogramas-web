import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { IEstadistica } from './model/estadistica';
import { IPictogramaEstadistica } from './model/pictogramaEstadistica';
import {
  ObtenerPictogramaConImagenes,
  ObtenerPictogramasConImagenes,
  PictogramaNoSeDebeTraducir,
} from '../pictogramas/services/pictogramas-services';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
} from '@mui/material';

export default function TimeLine(props: any) {
  const [pictogramasMañana, setPictogramasMañana] = useState(
    [] as IPictogramaEstadistica[]
  );
  const [pictogramasMediodia, setPictogramasMediodia] = useState(
    [] as IPictogramaEstadistica[]
  );
  const [pictogramasTarde, setPictogramasTarde] = useState(
    [] as IPictogramaEstadistica[]
  );
  const [pictogramasNoche, setPictogramasNoche] = useState(
    [] as IPictogramaEstadistica[]
  );

  useEffect(() => {
    let estadisticas = props.estadisticas as IEstadistica[];
    let mañana = estadisticas.filter(
      (e) =>
        new Date(e.fecha).getHours() >= 6 && new Date(e.fecha).getHours() < 12
    );
    let mediodia = estadisticas.filter(
      (e) =>
        new Date(e.fecha).getHours() >= 12 && new Date(e.fecha).getHours() < 16
    );
    let tarde = estadisticas.filter(
      (e) =>
        new Date(e.fecha).getHours() >= 16 && new Date(e.fecha).getHours() < 20
    );
    let noche = estadisticas.filter(
      (e) =>
        new Date(e.fecha).getHours() >= 20 || new Date(e.fecha).getHours() < 2
    );

    // console.log("ESTADISTICAS MAÑANA: ", mañana)
    // console.log("ESTADISTICAS MEDIODIA: ", mediodia)
    // console.log("ESTADISTICAS TARDE: ", tarde)
    // console.log("ESTADISTICAS NOCHE: ", noche)

    ObtenerPictogramasOrdenados(mañana).then((pics) => {
      //console.log("PICTOGRAMAS MAÑANA: ", pics)
      setPictogramasMañana(pics);
    });
    ObtenerPictogramasOrdenados(mediodia).then((pics) => {
      //console.log("PICTOGRAMAS MEDIODIA: ", pics)
      setPictogramasMediodia(pics);
    });
    ObtenerPictogramasOrdenados(tarde).then((pics) => {
      //console.log("PICTOGRAMAS TARDE: ", pics)
      setPictogramasTarde(pics);
    });
    ObtenerPictogramasOrdenados(noche).then((pics) => {
      //console.log("PICTOGRAMAS NOCHE: ", pics)
      setPictogramasNoche(pics);
    });
  }, []);

  async function ObtenerPictogramasOrdenados(
    estadisticas: IEstadistica[]
  ): Promise<IPictogramaEstadistica[]> {
    let pictogramas = [] as IPictogramaEstadistica[];
    estadisticas.forEach(async (estadistica) => {
      if (
        pictogramas.some(
          (p: IPictogramaEstadistica) => estadistica.pictograma === p.id
        )
      ) {
        // Ya existe, debo aumentar su contador
        await Promise.all(
          pictogramas.map((p) => {
            if (p.id === estadistica.pictograma) {
              p.cantidad += 1;
              p.estadisticas.push(estadistica);
            }
          })
        );
      } else {
        pictogramas = [
          ...pictogramas,
          {
            cantidad: 1,
            estadisticas: [estadistica],
            id: estadistica.pictograma,
            pictograma: null,
          },
        ];
      }
    });

    pictogramas = pictogramas.sort(compare).slice(0, 5);
    for (const picto of pictogramas) {
      picto.pictograma = await ObtenerPictogramaConImagenes(picto.id);
    }

    return pictogramas;
  }

  function compare(a, b) {
    if (a.cantidad > b.cantidad) {
      return -1;
    }
    if (a.cantidad < b.cantidad) {
      return 1;
    }
    return 0;
  }

  function renderPictograma(pictograma, index) {
    return (
      <Container key={pictograma.id ? pictograma.id : pictograma.identificador}>
        <Card
          sx={{
            maxWidth: 240 - (index*10),
            minWidth: 100 - (index*10),
            maxHeight: 240 - (index*10),
            minHeight: 50 - (index*10),
          }}
          style={{ marginTop: '10px' }}
          onClick={() => {}}
        >
          <CardActionArea onClick={() => {}}>
            <CardMedia
              component="img"
              height={160- (index*10)}
              width={170- (index*10)}
              src={
                pictograma.imagen && pictograma.imagen.includes('data:image')
                  ? pictograma.imagen
                  : `data:image/png;base64,${pictograma.imagen}`
              }
              alt={pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase()}
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
              {pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase()}
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    );
  }

  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          6:00 a 11:00
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot variant="outlined">
            {pictogramasMañana.length > 0 &&
              pictogramasMañana[0].pictograma &&
              renderPictograma(pictogramasMañana[0].pictograma, 0)}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          {pictogramasMañana.length > 1 && (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 10, md: 12 }}
            >
              {pictogramasMañana.map((pictograma) => {
                if (
                  pictograma.id !== pictogramasMañana[0].id &&
                  pictograma.pictograma
                )
                  return (
                    <Grid
                      key={
                        pictograma.pictograma.id
                          ? pictograma.pictograma.id
                          : pictograma.pictograma.identificador
                      }
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{marginLeft:15}}
                    >
                      {renderPictograma(pictograma.pictograma, pictogramasMañana.indexOf(pictograma))}
                    </Grid>
                  );
              })}
            </Grid>
          )}
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          variant="body2"
          color="text.secondary"
        >
          12:00 a 15:00
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="primary" variant="outlined">
            {pictogramasMediodia.length > 0 &&
              pictogramasMediodia[0].pictograma &&
              renderPictograma(pictogramasMediodia[0].pictograma, 0)}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          {pictogramasMediodia.length > 1 && (
            <Grid
              container
              direction="row-reverse"
              justifyContent="flex-start"
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 10, md: 12 }}
            >
              {pictogramasMediodia.map((pictograma) => {
                if (
                  pictograma.id !== pictogramasMediodia[0].id &&
                  pictograma.pictograma
                )
                  return (
                    <Grid
                      key={
                        pictograma.pictograma.id
                          ? pictograma.pictograma.id
                          : pictograma.pictograma.identificador
                      }
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{marginRight:15}}
                    >
                      {renderPictograma(pictograma.pictograma, pictogramasMediodia.indexOf(pictograma))}
                    </Grid>
                  );
              })}
            </Grid>
          )}
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          16:00 a 19:00
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot variant="outlined">
            {pictogramasTarde.length > 0 &&
              pictogramasTarde[0].pictograma &&
              renderPictograma(pictogramasTarde[0].pictograma, 0)}
          </TimelineDot>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          {pictogramasTarde.length > 1 && (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 10, md: 12 }}
            >
              {pictogramasTarde.map((pictograma) => {
                if (
                  pictograma.id !== pictogramasTarde[0].id &&
                  pictograma.pictograma
                )
                  return (
                    <Grid
                      key={
                        pictograma.pictograma.id
                          ? pictograma.pictograma.id
                          : pictograma.pictograma.identificador
                      }
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{marginLeft:15}}
                    >
                      {renderPictograma(pictograma.pictograma, pictogramasTarde.indexOf(pictograma))}
                    </Grid>
                  );
              })}
            </Grid>
          )}
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          variant="body2"
          color="text.secondary"
        >
          20:00 a 24:00
        </TimelineOppositeContent>
        <TimelineSeparator >
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
          <TimelineDot color="primary" variant="outlined">
            {pictogramasNoche.length > 0 &&
              pictogramasNoche[0].pictograma &&
              renderPictograma(pictogramasNoche[0].pictograma, 0)}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          {pictogramasNoche.length > 1 && (
            <Grid
              container
              direction="row-reverse"
              justifyContent="flex-start"
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 10, md: 12 }}
            >
              {pictogramasNoche.map((pictograma) => {
                if (
                  pictograma.id !== pictogramasNoche[0].id &&
                  pictograma.pictograma
                )
                  return (
                    <Grid
                      key={
                        pictograma.pictograma.id
                          ? pictograma.pictograma.id
                          : pictograma.pictograma.identificador
                      }
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{marginRight:15}}
                    >
                      {renderPictograma(pictograma.pictograma, pictogramasNoche.indexOf(pictograma))}
                    </Grid>
                  );
              })}
            </Grid>
          )}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
