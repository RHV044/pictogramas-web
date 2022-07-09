
import { Button, Card, CardActionArea, CardContent, CardHeader, TextField } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const SeleccionarCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [usuario, setUsuario] = useState("");

  return (
    <Container>
      <Container>
        <Card
          // style={{ borderRadius: '50%', paddingTop: '81.25%', margin: '28px' }}
          onClick={() => {
            navigate('/pictogramas' + location.search);
          }}
        >
          <CardActionArea>
            <CardHeader title="Usuario"></CardHeader>
            <CardContent>{/* Quizas agregar una imagen */}</CardContent>
          </CardActionArea>
        </Card>
        <Button
          onClick={() => {
            navigate('/cuenta/modificar' + location.search);
          }}
        > Modificar Cuenta </Button>
      </Container>
      <Button
        onClick={() => {
          navigate('/cuenta/agregar' + location.search);
        }}
      > Agregar Cuenta </Button>
    </Container>
  );
}

export default SeleccionarCuenta