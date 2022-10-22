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
  ObtenerPictogramasPorCategoria,
} from '../../services/pictogramas-services';

export default function Recientes(props: any) {
  const [checked, setChecked] = useState(false);
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [db1, setDb1] = useState(new IndexedDbService());
  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);

  useEffect(() => {
    // TODO: Cambiar a Obtencion de pictogramas recientes
    ObtenerPictogramasPorCategoria(setPictogramas, -1);
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
      }
    });
  }, []);

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
        pictograma.schematic === false) 
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
        {pictogramas.map((pictograma) => {
          if (cumpleFiltros(pictograma, userLogueado))
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
                        maxWidth: 230,
                        minWidth: 70,
                        maxHeight: 240,
                        minHeight: 50,
                      }}
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

  return (
    <Box style={{marginLeft: 20}}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Recientes"
      />
      {checked && <Box sx={{ display: 'flex' }}>{pictogramasRecientes}</Box>}
    </Box>
  );
}
