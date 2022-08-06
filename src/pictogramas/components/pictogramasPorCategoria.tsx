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
import { IUsuario } from '../../login/model/usuario';
import { getUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';
import { IPictogram } from '../models/pictogram';
import { ObtenerPictogramasPorCategoria } from '../services/pictogramas-services';

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

  useEffect(() => {
    ObtenerPictogramasPorCategoria(setPictogramas, props.categoria);
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
      return pictograma.aac === usuario.aac &&
            pictograma.aacColor === usuario.aacColor &&
            pictograma.hair === usuario.hair &&
            pictograma.schematic === usuario.schematic &&
            pictograma.sex === usuario.sex &&
            pictograma.skin === usuario.skin &&
            pictograma.violence === usuario.violence
  }

  return (
    <Container>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 10, md: 12 }}>
        {pictogramas.map((pictograma) => {
          if(cumpleFiltros(pictograma, userLogueado))
          return (
            //Como estan dentro de la categoria, se visualizan abajo, habria que extraerlo a otro lugar
            <Grid key={pictograma.id} item xs={12} sm={4} md={2}>
              <Container key={pictograma.id}>
                <Card
                  sx={{ maxWidth: 245, minWidth:150 }}
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
                </Card>
              </Container>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

