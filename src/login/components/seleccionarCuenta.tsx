
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { IUsuario } from '../model/usuario';
import { cerrarSesionUsuario, getUsuarioLogueado, ObtenerUsuarios, setUsuarioLogueado, usuarioLogueado } from '../../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';

const SeleccionarCuenta = (props: any) => {
  
  let navigate = useNavigate();
  let location = useLocation();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState (IndexedDbService.create())
  const [db1, setDb1] = useState(new IndexedDbService())

  cerrarSesionUsuario();
  
  getUsuarioLogueado().then(usuario => {
    if(usuario){
      setUsuarioLogueado(usuario);
      navigate('/pictogramas' + location.search);
    }
  })  

  useEffect(() => {
    console.log('vamos a obtener los usuarios')
    db.then(d => {
      setDb1(d)
      d.getAllValues("usuarios")
      .then(usuarios => {
        console.log(usuarios)
        setUsuarios(usuarios)
      })
    })
  }, []);

  return (
    <Container>
    <Grid container>
    {
        usuarios.map((usuario) => {
        return (
        <Grid key={usuario.id}        
        item xs={12} sm={6} md={4}>
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
              <CardContent></CardContent>
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
              await db1.deleteValue("usuarios", usuario.id != null ? usuario.id : 0)
              setUsuarios(usuarios.filter(u => u.nombreUsuario != usuario.nombreUsuario))
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>)
      })}
      
    </Grid>  
    <Box textAlign='center'>
        <Button
          variant="contained"
          style={{ alignItems:'center', marginBottom: '10px' }}
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
          style={{ alignItems:'center', marginBottom: '10px' }}
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