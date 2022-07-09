
import { Button, Card, CardActionArea, CardContent, CardHeader, TextField } from '@mui/material';
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
            // style={{ borderRadius: '50%', paddingTop: '81.25%', margin: '28px' }}
            onClick={() => {
              navigate('/pictogramas' + location.search);
            }}
          >
            <CardActionArea>
              <CardHeader title={usuario.username}></CardHeader>
              <CardContent>{/* Quizas agregar una imagen */}</CardContent>
            </CardActionArea>
          </Card>
          <Button
            onClick={() => {
              navigate('/cuenta/modificar' + location.search);
            }}
          > Modificar Cuenta </Button>
        </Container>)
      })}
      <Button
        onClick={() => {
          navigate('/cuenta/agregar' + location.search);
        }}
      > Agregar Cuenta </Button>
    </Container>
  );
}

export default SeleccionarCuenta