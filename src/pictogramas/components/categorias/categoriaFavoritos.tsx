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
import { IUsuario } from '../../../login/model/usuario';
import { getUsuarioLogueado } from '../../../services/usuarios-services';
import { ICategoria } from '../../models/categoria';
import imagenUsuario from '../../../commons/imagen-usuario.jpg'

export default function CategoriaFavoritos(props: any) {
  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);
  useEffect(() => {
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
      }
    });
  }, []);


  return (
    <Grid
      key={-2}
      item xs={4} sm={3} md={2}
    >
      <Container key={-2}>
        <Card
          sx={{ maxWidth: 240, minWidth:70, maxHeight: 240, minHeight: 50 }}
          style={{ marginTop: '10px' }}
        >
          <CardActionArea
            onClick={() => {
              if (
                props.categoriaSeleccionada == null ||
                props.categoriaSeleccionada !== -2
              ) {
                let categoria = {id: -2, nombre: "Pictogramas Favoritos", esCategoriaFinal: true, imagen:  userLogueado && userLogueado.imagen && userLogueado.imagen !== "" ? userLogueado.imagen : imagenUsuario} as ICategoria
                props.setCategoriaSeleccionada(categoria);
              } else {
                props.setCategoriaSeleccionada(null);
              }
            }}
          >
            <CardMedia
              component="img"
              height="180"
              width="180"
              src={userLogueado && userLogueado.imagen && userLogueado.imagen !== "" ? userLogueado.imagen : imagenUsuario}
              alt="Pictogramas Favoritos"
            ></CardMedia>
            <CardHeader
              style={{
                height: '100%',
                width: '95%',
                marginBottom: 1,
                paddingBottom: 0
              }} 
            >              
            </CardHeader>
            <CardContent
              style={{
                marginTop: 1,
                paddingTop: 0,
                marginLeft: 4,
                paddingLeft: 0,
                fontWeight: 'bold'
              }}
            >
            PICTOGRAMAS FAVORITOS
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Grid>
  );
}
