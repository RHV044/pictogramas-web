import { Box, Button, Container, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IUsuario } from '../model/usuario';
import {
  ActualizarUsuarioPassword,
  usuarioLogueado,
} from '../../services/usuarios-services';
import Logo from '../../commons/Logo-PictogAR.png';

const db = new IndexedDbService();

const ModificarCuenta = (props: any) => {
  let navigate = useNavigate();
  let location = useLocation();
  const [usuario, setUsuario] = useState(usuarioLogueado as IUsuario);

  return (
    <Container>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img alt="Qries" src={Logo} height="65" />
      </Box>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container>
          <Box
            border={4}
            borderLeft={2}
            borderRight={2}
            borderColor="primary.main"
            style={{ marginTop: 10, padding: 10, backgroundColor: 'white' }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextField
                id="filled-basic"
                label="Usuario"
                variant="filled"
                value={usuario.nombreUsuario}
                disabled={true}
              />
              <TextField
                id="filled-basic"
                label="Contraseña"
                variant="filled"
                onChange={(evt) => {
                  usuario.password = evt.target.value;
                }}
              />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                type="button"
                color="primary"
                className="form__custom-button"
                variant="outlined"
                style={{ margin: 5 }}
                onClick={async () => {
                  await ActualizarUsuarioPassword(usuario);
                  await db.putOrPatchValue('usuarios', usuario);
                  navigate('/cuenta/seleccionar' + location.search);
                }}
              >
                Cambiar Contraseña
              </Button>
            </Box>
            <Box textAlign="center">
              <Button
                variant="contained"
                style={{ alignItems: 'center', marginBottom: '10px' }}
                onClick={() => {
                  navigate('/cuenta/seleccionar' + location.search);
                }}
              >
                Volver a Seleccion de Cuenta
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default ModificarCuenta;
