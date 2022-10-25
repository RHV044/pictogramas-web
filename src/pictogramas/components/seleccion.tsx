import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { IPictogram } from '../models/pictogram';
import React from 'react';
import Speech from 'react-speech';
import { ObtenerInterpretacionNatural } from '../services/pictogramas-services';
import { lightBlue } from '@mui/material/colors';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Delete, Mic } from '@mui/icons-material';

const apiPictogramas = process.env.REACT_APP_URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function Seleccion(props: any) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [textoInterpretado, setTextoInterpretado] = useState('' as string);
  const [textoAInterpretar, setTextoAInterpretar] = useState('' as string);
  const refInterpretacionLiteral = useRef();
  var i = 0;
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    console.log('pictogramas Actualizados: ', props.pictogramas);
    setPictogramas(props.pictogramas);
  }, [props.pictogramas]);

  useEffect(() => {
    let texto = props.pictogramas.map((p) => p.keywords[0].keyword).toString();
    // ObtenerInterpretacionNatural(texto).then(interpretacion => {
    //   setTextoInterpretado(interpretacion)
    // })
    setTextoAInterpretar(texto);
  }, [props.pictogramas]);

  // TODO: IDEAL QUE ESTO OBTENGA CUANDO LE DEMOS AL BOTON Y AHI LE DE EL TEXTO
  const ObtenerInterpretacion = () => {
    ObtenerInterpretacionNatural(textoAInterpretar).then((interpretacion) => {
      return interpretacion;
    });
  };

  function simulateMouseClick(element) {
    const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    mouseClickEvents.forEach((mouseEventType) =>
      element.dispatchEvent(
        new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
        })
      )
    );
  }

  return (
    <Container style={{ padding: 10 }}>
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
                  sx={{
                    maxWidth: 230,
                    minWidth: 70,
                    maxHeight: 240,
                    minHeight: 50,
                  }}
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
                      height="160"
                      width="140"
                      src={
                        pictograma.imagen &&
                        pictograma.imagen.includes('data:image')
                          ? pictograma.imagen
                          : `data:image/png;base64,${pictograma.imagen}`
                      }
                      alt={pictograma.keywords[0].keyword}
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
                      }}
                    >
                      {pictograma.keywords[0].keyword}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Container>
            </Grid>
          );
        })}
      </Grid>
      {pictogramas.length > 0 && (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 10, md: 12 }}
          alignItems="center"
          justifyContent="center"
          style={{ marginTop: 0 }}
        >
          <Grid key="Literal" item xs={12} sm={4} md={2}>
            <Button
              style={{
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                width: '100%',
              }}
              variant="contained"
              component="label"
              onClick={() => {
                speak({ text: textoAInterpretar });
              }}
            >
              <Mic>
              </Mic>
              Interpretacion Literal
            </Button>
          </Grid>
          {textoAInterpretar.length > 0 && (
            <Grid key="Natural" item xs={12} sm={4} md={2}>
              <Button
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 5,
                  width: '100%',
                }}
                variant="contained"
                component="label"
                onClick={() => {
                  let texto = ObtenerInterpretacion();
                  speak({ text: texto });
                }}
              >
                <Mic>
                </Mic>
                Interpretacion Natural
              </Button>
            </Grid>
          )}
          <Grid key="ReiniciarSeleccion" item xs={12} sm={4} md={2}>
            <Button 
              variant="outlined"
              onClick={() => props.setPictogramas([])}
            >
              <Delete>                
              </Delete>
              Reiniciar Seleccion
            </Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
