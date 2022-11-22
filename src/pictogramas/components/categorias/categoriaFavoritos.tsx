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
import imagenUsuario from '../../../commons/imagen-usuario-blue.png'
import LogoFavoritos from '../../../commons/star_icon.png';
import Icon, { StarRounded } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
      item xs={6} sm={6} md={6} >
      <Container key={-2}>
        <Card>
          <CardActionArea
            onClick={() => {
              if (
                props.categoriaSeleccionada == null ||
                props.categoriaSeleccionada !== -2
              ) {
                let categoria = {id: -2, nombre: "Pictogramas Favoritos", esCategoriaFinal: true} as ICategoria
                props.setCategoriaSeleccionada(categoria);
              } else {
                props.setCategoriaSeleccionada(null);
              }
            }} >
            <CardContent>
              <Button variant="text"
                startIcon={<StarRounded />}
                sx={{typography: { sm: 'body1', xs: 'body2', color: '#00A7E1'}, fontFamily:'Arial', 
                  fontWeight:'medium'}}> PICTOGRAMAS FAVORITOS
              </Button>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Grid>
  );
}
