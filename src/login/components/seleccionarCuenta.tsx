
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { IUsuario } from '../model/usuario';
import { ObtenerUsuarios, setUsuarioLogueado } from '../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
const db = new IndexedDbService();

const SeleccionarCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);

  useEffect(() => {
    console.log('vamos a obtener los usuarios')
    // TODO: Los usuarios hay que traerlos de indexddb
    //ObtenerUsuarios(setUsuarios)
    db.getAllValues("usuarios")
      .then(usuarios => {
        console.log(usuarios)
        setUsuarios(usuarios)
      })
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
              setUsuarioLogueado(usuario);
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
            onClick={async () => {
              console.log('guardamos el usuario: ', usuario)
              setUsuarioLogueado(usuario);
              navigate('/cuenta/modificar' + location.search);
            }}
          > Modificar Cuenta </Button>
          <IconButton
            onClick={async () => {
              await db.deleteValue("usuarios", usuario.id != null ? usuario.id : 0)
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
            navigate('/cuenta/vincular' + location.search);
          }}
        > 
          Vincular Cuenta
        </Button>
      </Box>
      <Box textAlign='center'>
        <Button
          variant="contained"
          style={{ alignItems:'center' }}
          onClick={() => {
            navigate('/cuenta/crear' + location.search);
          }}
        > 
          Crear Cuenta
        </Button>
      </Box>
    </Container>
  );
}

export default SeleccionarCuenta