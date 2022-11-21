import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect, useState } from 'react';
import { IUsuario } from '../../../login/model/usuario';
import {
  ElmiminarPictogramaDeUsuario,
  getUsuarioLogueado,
  usuarioLogueado,
} from '../../../services/usuarios-services';
import { IPictogram } from '../../models/pictogram';
import { ObtenerPictogramasPorCategoria, PictogramaNoSeDebeTraducir } from '../../services/pictogramas-services';
import { IndexedDbService } from '../../../services/indexeddb-service';
import FavoritoButton from '../FavoritoButton';
import Categoria from './categoria';

const apiPictogramas = process.env.REACT_APP_URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function PictogramasPorCategoria(props: any) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);

  const [db1, setDb1] = useState(new IndexedDbService());

  useEffect(() => {
    ObtenerPictogramasPorCategoria(setPictogramas, props.categoria);
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

  const favoritos =
    userLogueado && userLogueado.id
      ? db1.searchFavoritoByUser(userLogueado.id)
      : [];

  return (
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
                    style={{ marginTop: '10px', paddingLeft: 5, paddingRight: 5, paddingBottom: 20   }}
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
                        width="160"
                        src={
                          pictograma.imagen &&
                          pictograma.imagen.includes('data:image')
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
                          paddingBottom:0
                        }}
                      >
                        {/* <Typography
                          variant="button"
                          display="overline"
                          style={{
                            paddingBottom: 0,
                            
                          }}
                          gutterBottom
                        > */}
                          {pictograma.keywords.length > 1 && pictograma.keywords[0].tipo !== 1 && PictogramaNoSeDebeTraducir(pictograma) ? pictograma.keywords[1].keyword.toLocaleUpperCase() : pictograma.keywords[0].keyword.toLocaleUpperCase()}
                        {/* </Typography> */}
                      </CardContent>
                    </CardActionArea>

                    <FavoritoButton
                      esFavorito={props.categoria === -2}
                      pictograma={pictograma}
                      favoritos={favoritos}
                    />

                    {usuarioLogueado?.id === pictograma.idUsuario && (
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
              </Grid>
            );
        })}
      </Grid>
    </Container>
  );
}
