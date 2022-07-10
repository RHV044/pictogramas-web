
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { IUsuario } from '../model/usuario';
import { ObtenerUsuarios } from '../services/usuarios-services';

const SeleccionarCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);

  useEffect(() => {
    console.log('vamos a obtener los usuarios')
    ObtenerUsuarios(setUsuarios)
  }, []);

  return (
    <Container>
      {
        usuarios.map((usuario) => {
        return (<Container>
          <Card                        
            sx={{ maxWidth: 345 }}               
            style={{ marginTop: '10px' }}
            onClick={() => {
              navigate('/pictogramas' + location.search);
            }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="https://www.lavanguardia.com/files/content_image_mobile_filter/uploads/2017/04/24/5fa3cfbde979b.jpeg"
                alt="MESSI"
              >
              </CardMedia>
              <CardHeader title={usuario.nombreUsuario}></CardHeader>
              <CardContent>{/* Quizas agregar una imagen */}</CardContent>
            </CardActionArea>
          </Card>
          <Button
            variant="outlined"
            style={{ marginBottom: '10px' }}
            onClick={() => {
              navigate('/cuenta/modificar' + location.search);
            }}
          > Modificar Cuenta </Button>
          <IconButton
            onClick={() => {
              setUsuarios(usuarios.filter(u => u.nombreUsuario != usuario.nombreUsuario))
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Container>)
      })}
      <Box textAlign='center'>
        <Button
          variant="contained"
          style={{ alignItems:'center' }}
          onClick={() => {
            navigate('/cuenta/agregar' + location.search);
          }}
        > 
          Agregar Cuenta 
        </Button>
      </Box>
    </Container>
  );
}

export default SeleccionarCuenta