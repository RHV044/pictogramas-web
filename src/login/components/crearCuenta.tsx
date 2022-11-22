import { Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CrearUsuario } from '../../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IUsuario } from '../model/usuario';
import Logo from '../../commons/Logo-PictogAR-viejo.png';

const CrearCuenta = (props: any) => {
  let navigate = useNavigate();
  let location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function crearUsuario() {
    let usuario = {
      nombreUsuario: username,
      password: password,
      aac: false,
      aacColor: false,
      hair: false,
      sex: false,
      skin: false,
      violence: false,
      schematic: false,
      nivel: 0,
    } as IUsuario;
    // La creacion del usuario es online, de esta manera se obtiene id desde la api
    await CrearUsuario(usuario).then((user) => {
      IndexedDbService.create().then(async (db) => {
        console.log('user creado: ', user);
        await db.putOrPatchValue('usuarios', user);
        navigate('/cuenta/seleccionar' + location.search);
      });
    });
  }

  return (
    <div 
      style={{ 
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: "#003882" }} >
      <Container>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10
          }}
        >
          <img alt="PictogAr" src={Logo} height="65" />
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
                    await crearUsuario();
                  }}
                >
                  Crear Cuenta
                </Button>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
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
    </div>
  );
};

export default CrearCuenta;
