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
import { ObtenerInterpretacionNatural, PictogramaNoSeDebeTraducir, TraducirKeyword } from '../services/pictogramas-services';
import { lightBlue } from '@mui/material/colors';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Delete, DeleteRounded, Mic, MicRounded } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

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
    let texto = props.pictogramas.map((p) => TraducirKeyword(p.keywords[0].keyword)).toString();
    // ObtenerInterpretacionNatural(texto).then(interpretacion => {
    //   setTextoInterpretado(interpretacion)
    // })
    setTextoAInterpretar(texto);
  }, [props.pictogramas]);

  // TODO: IDEAL QUE ESTO OBTENGA CUANDO LE DEMOS AL BOTON Y AHI LE DE EL TEXTO
  const ObtenerInterpretacion = async () => {
    var text = textoAInterpretar.replace(/,/g, ' ');
    return await ObtenerInterpretacionNatural(text)
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
    <Container style={{ paddingTop: 10 }}>
      <Grid container
        rowSpacing={{ xs: 2, sm: 2, md: 2 }}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }} >
        {pictogramas.map((pictograma: IPictogram) => {
          return (
            <Grid item key={i++} xs={12} sm={4} md={2}>
              <Container key={i++}>
                <Card
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
                      src={
                        pictograma.imagen &&
                        pictograma.imagen.includes('data:image')
                          ? pictograma.imagen
                          : `data:image/png;base64,${pictograma.imagen}`
                      }
                      alt={TraducirKeyword(pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 &&
                        PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() :
                        pictograma.keywords[0].keyword.toLocaleUpperCase())}
                    ></CardMedia>
                    <CardContent style={{ paddingTop: 4, paddingLeft: 4}} >
                      <Typography 
                        sx = {{typography: { sm: 'body1', xs: 'body2' } }} 
                        fontFamily="Arial"
                        fontWeight="medium"
                        color="#00A7E1" >
                        {TraducirKeyword(pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && 
                          PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : 
                          pictograma.keywords[0].keyword.toLocaleUpperCase())}  
                      </Typography>
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
        <Grid item key="Literal">
          <Button onClick={() => { speak({ text: textoAInterpretar }); }} 
            variant="contained" 
            startIcon={<MicRounded />} 
            sx={{fontFamily:'Arial', fontWeight:'bold', background:'#00A7E1'}}>
              Interpretación Literal</Button>
         </Grid>
          {textoAInterpretar.length > 0 && (
          <Grid item key="Natural">
            <Button onClick={async () => {
              let texto = await ObtenerInterpretacion();
              speak({ text: texto }); }}
              variant="contained" 
              startIcon={<MicRounded />} 
              sx={{fontFamily:'Arial', fontWeight:'bold', background:'#00A7E1'}}>
                Interpretación Natural</Button>
          </Grid>
          )}
          <Grid item key="ReiniciarSeleccion">
          <Button onClick={() => props.setPictogramas([])}
            variant="outlined" 
            startIcon={<DeleteRounded />} 
            sx={{fontFamily:'Arial', fontWeight:'bold', color:'#00A7E1'}}>
              Borrar frase</Button>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
