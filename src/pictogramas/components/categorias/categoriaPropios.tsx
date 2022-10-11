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

export default function CategoriaPropios(props: any) {
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
      key={-1}
      item xs={4} sm={3} md={2}
    >
      <Container key={-1}>
        <Card
          sx={{ maxWidth: 230, minWidth:70, maxHeight: 240, minHeight: 50 }}
          style={{ marginTop: '10px' }}
        >
          <CardActionArea
            onClick={() => {
              if (
                props.categoriaSeleccionada == null ||
                props.categoriaSeleccionada !== -1
              ) {
                let categoria = {id: -1, nombre: "Pictogramas Propios", esCategoriaFinal: true } as ICategoria
                props.setCategoriaSeleccionada(categoria);
              } else {
                props.setCategoriaSeleccionada(null);
              }
            }}
          >
            <CardMedia
              component="img"
              height="160"
              width="140"
              src={userLogueado && userLogueado.imagen && userLogueado.imagen !== "" ? userLogueado.imagen : imagenUsuario}
              alt="Pictogramas Propios"
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
            Pictogramas Propios
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Grid>
  );
}
