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
import { getUsuarioLogueado, usuarioLogueado } from '../../../services/usuarios-services';
import { IPictogram } from '../../models/pictogram';
import { ObtenerPictogramasPorCategoria } from '../../services/pictogramas-services';
import { IndexedDbService } from '../../../services/indexeddb-service';
import FavoritoButton from '../FavoritoButton';

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
    //TODO: Obtener categorias Hijas
  }, []);

  useEffect(() => {
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
    return (pictograma.aac === usuario.aac || pictograma.aac === false) &&
      (pictograma.aacColor === usuario.aacColor || pictograma.aacColor === false) &&
      (pictograma.hair === usuario.hair || pictograma.hair === false) &&
      (pictograma.schematic === usuario.schematic || pictograma.schematic === false) &&
      (pictograma.sex === usuario.sex || pictograma.sex === false) &&
      (pictograma.skin === usuario.skin || pictograma.skin === false) &&
      (pictograma.violence === usuario.violence || pictograma.violence === false)
  }


  function eliminarPictograma(idPictograma: number) {
    db1.deleteValue("pictogramas", idPictograma) //!= null ? idPictograma : 0 //Preguntar: le saque el await, esta bien? 
    //TODO primero, ver si hay que borrarlo de mas tablas. segundo, falta llamar a la api ¿esos seria aca o en otro lado?
  }

  return (
    <Container>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 10, md: 12 }}>
        {/* 
        TODO: Hay que tener en cuenta que ahora una categoria puede ser hija de otra 
          Esto implica que seguro haya que refactorizar para que cuando se seleccione una categoria,
          muestre categorias hijas y pictogramas que solo dependan de esa categoria
        */}
        {pictogramas.map((pictograma) => {
          if (cumpleFiltros(pictograma, userLogueado))
            return (
              //Como estan dentro de la categoria, se visualizan abajo, habria que extraerlo a otro lugar
              <Grid key={pictograma.id} item xs={12} sm={4} md={2}>
                <Container key={pictograma.id}>
                  <Card
                    sx={{ maxWidth: 245, minWidth: 150 }}
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

                    <FavoritoButton />
                    
                    <IconButton
                      aria-label='eliminar'
                      disabled={usuarioLogueado?.id !== pictograma.idUsuario}
                      onClick={() => {
                        eliminarPictograma(pictograma.id);
                        db1.deleteValue("pictogramas", pictograma.id);
                        //PREGUNTAR/TODO cómo eliminar en las tablas relacionadas (pictogramasPorCategorias y FavoritosPorCategorias)
                        //TODO agregarborrar del storage
                      }}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Card>
                </Container>
              </Grid>
            );
        })}
      </Grid>
    </Container>
  );
}

