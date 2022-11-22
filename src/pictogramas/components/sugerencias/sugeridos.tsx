import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Theme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
} from '@mui/material';
import { Container } from '@mui/system';
import FavoritoButton from '../FavoritoButton';
import { IndexedDbService } from '../../../services/indexeddb-service';
import { getUsuarioLogueado } from '../../../services/usuarios-services';
import { IUsuario } from '../../../login/model/usuario';
import { IPictogram } from '../../models/pictogram';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  ObtenerImagenDePictogramaLocal,
  PictogramaNoSeDebeTraducir,
} from '../../services/pictogramas-services';
import PredictivoImagen from './assets/adivinar.png';
import { AutoAwesome, QuestionMarkRounded, SettingsSuggestRounded, StarsRounded } from '@mui/icons-material';
import Button from '@mui/material/Button';

export default function Sugeridos(props: any) {
  const [checked, setChecked] = useState(false);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [db1, setDb1] = useState(new IndexedDbService());
  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);

  useEffect(() => {
    // TODO: Cambiar a Obtencion de pictogramas recientes
    let pictogramasPredecidos = props.pictogramasPredecidos;
    if (pictogramasPredecidos) {
      pictogramasPredecidos.map(async (p: IPictogram) => {
        if (p !== undefined && p !== null) {
          ObtenerImagenDePictogramaLocal(p.id).then((imagen) => {
            if (imagen && imagen.imagen) {
              p.imagen = imagen.imagen;
            }
          });
        }
      });
      setPictogramas(props.pictogramasPredecidos);
    }
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
      }
    });
  }, [props.pictogramasPredecidos]);

  function cumpleFiltros(
    pictograma: IPictogram,
    usuario: IUsuario | any
  ): boolean {
    if (!pictograma || !usuario) return true;

    return (
      (pictograma.violence === usuario.violence ||
        pictograma.violence === false) &&
      (pictograma.sex === usuario.sex || pictograma.sex === false) &&
      (pictograma.schematic === usuario.schematic ||
        pictograma.schematic === true)
      //   && (pictograma.aacColor === usuario.aacColor ||
      //   pictograma.aacColor === false) &&
      // (pictograma.aac === usuario.aac || pictograma.aac === false)
    );
  }

  async function eliminarPictograma(pictograma: IPictogram) {
    //TODO: Se debe actualizar a pendiente de eliminacion = true, y el update service la eliminara asincronicamente
    // El pictograma siempre es propio, no hace falta chequear si es de arasaac
    pictograma.pendienteEliminacion = true;
    await db1.putOrPatchValue('pictogramasPropios', pictograma);
    dispatchEvent(new CustomEvent('sincronizar'));
  }

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const favoritos =
    userLogueado && userLogueado.id
      ? db1.searchFavoritoByUser(userLogueado.id)
      : [];

  const pictogramasRecientes = (
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
      >
        {pictogramas &&
          pictogramas.length > 0 &&
          pictogramas.map((pictograma) => {
            if (pictograma && cumpleFiltros(pictograma, userLogueado))
              return (
                <Grid
                  key={pictograma.id ? pictograma.id : pictograma.identificador}
                  item
                  xs={12}
                  sm={4}
                  md={2}
                >
                  <Grow
                    in={checked}
                    style={{ transformOrigin: '0 0 0' }}
                    {...(checked ? { timeout: 1000 } : {})}
                  >
                    <Container
                      key={
                        pictograma.id ? pictograma.id : pictograma.identificador
                      }
                    >
                      <Card
                        sx={{
                          maxWidth: 250,
                          minWidth: 160,
                          maxHeight: 250,
                          minHeight: 75,
                        }}
                        style={{
                          marginTop: '10px',
                          paddingLeft: 5,
                          paddingRight: 5,
                          paddingBottom: 20,
                        }}
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
                            height="170"
                            width="170"
                            src={
                              pictograma.imagen &&
                              pictograma.imagen.includes('data:image')
                                ? pictograma.imagen
                                : `data:image/png;base64,${pictograma.imagen}`
                            }
                            alt={
                              pictograma.keywords.length > 1 &&
                              pictograma.keywords[0].tipo !== 1 &&
                              PictogramaNoSeDebeTraducir(pictograma)
                                ? pictograma.keywords[1].keyword.toLocaleUpperCase()
                                : pictograma.keywords[0].keyword.toLocaleUpperCase()
                            }
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
                            {pictograma.keywords.length > 1 &&
                            pictograma.keywords[0].tipo !== 1 &&
                            PictogramaNoSeDebeTraducir(pictograma)
                              ? pictograma.keywords[1].keyword.toLocaleUpperCase()
                              : pictograma.keywords[0].keyword.toLocaleUpperCase()}
                          </CardContent>
                        </CardActionArea>

                        <FavoritoButton
                          pictograma={pictograma}
                          favoritos={favoritos}
                        />

                        {userLogueado?.id === pictograma.idUsuario && (
                          <IconButton
                            aria-label="eliminar"
                            onClick={() => {
                              eliminarPictograma(pictograma);
                            }}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        )}
                      </Card>
                    </Container>
                  </Grow>
                </Grid>
              );
          })}
      </Grid>
    </Container>
  );

  const imagen = (
    <Grid item
       xs={4} sm={4} md={4} >
      <Container>
        <Card>
          <CardActionArea
            onClick={() => {
              handleChange();
            }} >
            <CardContent>
              <Button variant="text"
                startIcon={<AutoAwesome />}
                sx={{typography: { sm: 'body1', xs: 'body2', color: '#00A7E1'}, fontFamily:'Arial', 
                  fontWeight:'medium'}}> SUGERIDOS
              </Button>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Grid>
  );

  return (
    <Box style={{ paddingTop: 16 }}>
      {imagen}
      {checked && <Box sx={{ display: 'flex' }}>{pictogramasRecientes}</Box>}
    </Box>
  );
}
