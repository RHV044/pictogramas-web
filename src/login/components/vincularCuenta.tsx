import { Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CrearUsuario, ObtenerUsuario } from '../../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
const db = new IndexedDbService();

const VincularCuenta = (props: any) => {
  let navigate = useNavigate();
  let location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
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
              style={{margin: 5}}
              onClick={async () => {
                // Se requiere conexion obligatoria para la vinculacion
                // Se debe registrar nada mas en el indexdbb
                let usuario = await ObtenerUsuario(username, password);
                console.log('usuario a vincular: ', usuario);
                await db.putOrPatchValue('usuarios', usuario);
                dispatchEvent(new CustomEvent('sincronizar'));
                navigate('/cuenta/seleccionar' + location.search);
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
  );
};

export default VincularCuenta;
