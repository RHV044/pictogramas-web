import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect, useState } from 'react';
import { IUsuario } from '../../../login/model/usuario';
import { ElmiminarPictogramaDeUsuario, getUsuarioLogueado, usuarioLogueado } from '../../../services/usuarios-services';
import { IPictogram } from '../../models/pictogram';
import { ObtenerPictogramasPorCategoria } from '../../services/pictogramas-services';
import { IndexedDbService } from '../../../services/indexeddb-service';
import FavoritoButton from '../FavoritoButton';
import Categoria from './categoria';

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? 'http://localhost:5000';

export default function PictogramasPorCategoria(props: any) {
  const [pictogramas, setPictogramas] = useState([] as IPictogram[]);
  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);

  const [violence, setViolence] = useState(false as boolean)
  const [sex, setSex] = useState(false as boolean)
  const [aac, setAac] = useState(false as boolean)
  const [aacColor, setAacColor] = useState(false as boolean)
  const [skin, setSkin] = useState(false as boolean)
  const [hair, setHair] = useState(false as boolean)
  const [schematic, setSchematic] = useState(false as boolean)

  const [db1, setDb1] = useState(new IndexedDbService())

  useEffect(() => {
    ObtenerPictogramasPorCategoria(setPictogramas, props.categoria);
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
        setViolence(usuario.violence);
        setSex(usuario.sex);
        setSkin(usuario.skin);
        setHair(usuario.hair);
        setAac(usuario.aac);
        setAacColor(usuario.aacColor);
        setSchematic(usuario.schematic);
      }
    });
  }, []);

  function cumpleFiltros(pictograma: IPictogram, usuario: IUsuario | any): boolean {
    if(!pictograma || !usuario) return true;
    

    return (pictograma.violence === usuario.violence || pictograma.violence === false) &&
      (pictograma.sex === usuario.sex || pictograma.sex === false) &&
      (pictograma.schematic === usuario.schematic || pictograma.schematic === false)  &&
      (pictograma.hair === usuario.hair || pictograma.hair === false) &&
      (pictograma.aacColor === usuario.aacColor || pictograma.aacColor === false) &&
      (pictograma.skin === usuario.skin || pictograma.skin === false) &&
      (pictograma.aac === usuario.aac || pictograma.aac === false)
  }


  async function eliminarPictograma(pictograma: IPictogram) {
    //TODO: Se debe actualizar a pendiente de eliminacion = true, y el update service la eliminara asincronicamente
    // El pictograma siempre es propio, no hace falta chequear si es de arasaac
    pictograma.pendienteEliminacion = true
    await db1.putOrPatchValue("pictogramasPropios", pictograma)
    dispatchEvent(new CustomEvent('sincronizar'));
  }

  const favoritos = (userLogueado && userLogueado.id) ? db1.searchFavoritoByUser(userLogueado.id) : [];

  return (
    <Container>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 10, md: 12 }}>     
        {pictogramas.map((pictograma) => {     
          console.log("se mapea pictograma: ", pictograma)
          console.log("imagen a mostrar: ", pictograma.idUsuario > 0 ? pictograma.imagen : `data:image/png;base64, ${pictograma.imagen}`)            
          if (cumpleFiltros(pictograma, userLogueado))
            return (
              //Como estan dentro de la categoria, se visualizan abajo, habria que extraerlo a otro lugar
              <Grid key={pictograma.id ? pictograma.id : pictograma.identificador} item xs={12} sm={4} md={2}>
                <Container key={pictograma.id ? pictograma.id : pictograma.identificador}>
                  <Card
                    sx={{ maxWidth: 230, minWidth: 50 }}
                    style={{ marginTop: '10px' }}
                    onClick={() => { }}
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
                        height="150"
                        //image={apiPictogramas+'/pictogramas/'+pictograma.id+'/obtener'}
                        //image={pictograma.imagen}
                        //TODO: Optimizar o ver alternativa para levantar los base64
                        src={pictograma.idUsuario > 0 ? pictograma.imagen : `data:image/png;base64,${pictograma.imagen}`}
                        alt={pictograma.keywords[0].keyword}
                      ></CardMedia>
                      <CardHeader           
                        style={{
                          height: '100%',
                          marginBottom: 1,
                          paddingBottom: 0
                        }} 
                        title={pictograma.keywords[0].keyword}
                      ></CardHeader>
                      <CardContent></CardContent>
                    </CardActionArea>

                    <FavoritoButton pictograma={pictograma} favoritos={favoritos} />

                    {
                      usuarioLogueado?.id === pictograma.idUsuario
                      &&
                      <IconButton
                        aria-label='eliminar'
                        onClick={() => {
                          eliminarPictograma(pictograma);
                        }}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    }
                  </Card>
                </Container>
              </Grid>
            );
        })}
      </Grid>
    </Container>
  );
}

