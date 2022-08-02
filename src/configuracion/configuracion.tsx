import ResponsiveAppBar from '../commons/appBar';
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  TextField,
} from '@mui/material';
import { Container } from '@mui/system';
import { IUsuario } from '../login/model/usuario';
import { IndexedDbService } from '../services/indexeddb-service';
import { useEffect, useState } from 'react';
import {
  ActualizarUsuario,
  getUsuarioLogueado,
  usuarioLogueado,
} from '../services/usuarios-services';
import { useNavigate } from 'react-router-dom';
import { Console } from 'console';

export default function Configuracion() {
  let navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState(IndexedDbService.create());

  const niveles = ['inicial', 'intermedio', 'avanzado'];

  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);
  const [violence, setViolence] = useState(false as boolean)

  useEffect(() => {
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
        setViolence(usuario.violence)
      }
    });
  }, []);

  const actualizarUsuario = async () => {
    if (userLogueado)
    {
      let usuario = userLogueado
      usuario.violence = violence;
      (await db).putOrPatchValue('usuarios', usuario)
    };
  }

  return (
    <div>
      {userLogueado && (
        <div>
          <ResponsiveAppBar />
          <Container>
            <FormControl component="fieldset" style={{ width: '50%' }}>
              <FormLabel style={{ padding: 10 }}>
                <h1>
                  {' '}
                  <SettingsIcon color="action" /> Configuración
                </h1>
              </FormLabel>
              <Paper style={{ width: '100%' }}>
                <Container style={{ padding: 10 }}>
                  Nombre{' '}
                  <input
                    type="text"
                    defaultValue={userLogueado.nombreUsuario}
                  />{' '}
                  <br />
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="nivel-label">Nivel</InputLabel>
                    <Select
                      labelId="nivel-label"
                      id="nivel-select-helper"
                      // value={nivel}
                      label="Nivel"
                      // onChange={handleChange}
                    >
                      <MenuItem>Inicial</MenuItem>
                      <MenuItem>Intermedio</MenuItem>
                      <MenuItem>Avanzado</MenuItem>
                    </Select>
                  </FormControl>
                </Container>
                <FormGroup aria-label="center" style={{ paddingRight: 10 }}>
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={violence}
                        onChange={(evt) => setViolence(evt?.target?.checked)}
                        // checked={userLogueado.violence}
                        // onChange={(evt) => {
                        //   let userLogueadoCopy = userLogueado;
                        //   userLogueadoCopy.violence = evt.target.checked;
                        //   setUserLogueado(userLogueadoCopy);
                        //   console.log('user: ', userLogueado);
                        // }}
                      />
                    }
                    label="Permitir Contenido violento"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userLogueado.sex}
                        onChange={(evt) => {
                          let userLogueadoCopy = userLogueado;
                          userLogueadoCopy.sex = evt.target.checked;
                          setUserLogueado(userLogueadoCopy);
                        }}
                      />
                    }
                    label="Permitir Contenido sexual"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userLogueado.skin}
                        onChange={(evt) => {
                          let userLogueadoCopy = userLogueado;
                          userLogueadoCopy.skin = evt.target.checked;
                          setUserLogueado(userLogueadoCopy);
                        }}
                      />
                    }
                    label="Tiene piel"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userLogueado.hair}
                        onChange={(evt) => {
                          let userLogueadoCopy = userLogueado;
                          userLogueadoCopy.hair = evt.target.checked;
                          setUserLogueado(userLogueadoCopy);
                        }}
                      />
                    }
                    label="Tiene pelo"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userLogueado.aac}
                        onChange={(evt) => {
                          let userLogueadoCopy = userLogueado;
                          userLogueadoCopy.aac = evt.target.checked;
                          setUserLogueado(userLogueadoCopy);
                        }}
                      />
                    }
                    label="Aac"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userLogueado.aacColor}
                        onChange={(evt) => {
                          let userLogueadoCopy = userLogueado;
                          userLogueadoCopy.aacColor = evt.target.checked;
                          setUserLogueado(userLogueadoCopy);
                        }}
                      />
                    }
                    label="AacColor"
                    labelPlacement="start"
                  />
                </FormGroup>
              </Paper>
            </FormControl>

            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                style={{ alignItems: 'center', margin: '10px' }}
                onClick={async () => {
                  // await ActualizarUsuario(usuarioLogueado)
                  actualizarUsuario()
                  window.location.reload();
                }}
              >
                Guardar
              </Button>
              <Button
                variant="outlined"
                style={{ alignItems: 'center', margin: '10px' }}
                onClick={() => {
                  navigate('../pictogramas');
                }}
              >
                Cancelar
              </Button>
            </Stack>
          </Container>
        </div>
      )}
    </div>
  );
}
