import { Alert, Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CrearUsuario, ObtenerUsuario } from '../../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
import Logo from '../../commons/Logo-PictogAR-viejo.png';

const db = new IndexedDbService();

const VincularCuenta = (props: any) => {
  let navigate = useNavigate();
  let location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usuarioIncorrecto, setUsuarioIncorrecto] = useState(false);

  return (
    <Container>
      {usuarioIncorrecto ? <Alert severity="error">Usuario Invalido</Alert> : <></>}
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
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: 'white',
            }}
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
                value={username}
                onChange={(evt) => {
                  setUsername(evt.target.value);
                }}
              />
              <TextField
                id="filled-basic"
                label="Contraseña"
                variant="filled"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(evt) => {
                  setPassword(evt.target.value);
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
                  // Se requiere conexion obligatoria para la vinculacion
                  // Se debe registrar nada mas en el indexdbb
                  let usuario = await ObtenerUsuario(username, password);
                  if (usuario === null || usuario === undefined) {
                    setUsuarioIncorrecto(true);
                    setTimeout(function () {
                      setUsuarioIncorrecto(false);
                    }, 1500);
                  } else {
                    console.log('usuario a vincular: ', usuario);
                    await db.putOrPatchValue('usuarios', usuario);
                    dispatchEvent(new CustomEvent('sincronizar'));
                    navigate('/cuenta/seleccionar' + location.search);
                  }
                }}
              >
                Vincular Cuenta
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

export default VincularCuenta;
