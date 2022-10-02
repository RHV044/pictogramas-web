import ResponsiveAppBar from '../commons/appBar';
import SettingsIcon from '@mui/icons-material/Settings';
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
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { Container } from '@mui/system';
import { IUsuario } from '../login/model/usuario';
import { IndexedDbService } from '../services/indexeddb-service';
import { useEffect, useState } from 'react';
import {
  ActualizarUsuarioPassword,
  getUsuarioLogueado,
  usuarioLogueado,
} from '../services/usuarios-services';
import { useNavigate } from 'react-router-dom';
import { Console } from 'console';
import Filtros from '../pictogramas/components/filtros';
import { ICategoria } from '../pictogramas/models/categoria';
import { formatDate, ObtenerCategorias } from '../pictogramas/services/pictogramas-services';
import React from 'react';
import FormDialogValidarAcceso from './components/validarCambioConfiguracion';

function agruparElementos(datos, predicado) : ICategoria[] { //agrupar categorias por algun campo en particular

  return datos.reduce((a, v, i) => (a[predicado(v, i) ? 0 : 1].push(v), a), [[], []]);
}

export default function Configuracion() {
  let navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState(IndexedDbService.create());
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(
    [] as ICategoria[]
  );

  const [personalizarCategorias, setPersonalizarCategorias] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setNivel(event.target.value as string);
  };


  const [userLogueado, setUserLogueado] = useState(null as IUsuario | null);
  const [nivel, setNivel] = React.useState('');
  const [violence, setViolence] = useState(false as boolean)
  const [sex, setSex] = useState(false as boolean)
  const [aac, setAac] = useState(false as boolean)
  const [aacColor, setAacColor] = useState(false as boolean)
  const [skin, setSkin] = useState(false as boolean)
  const [hair, setHair] = useState(false as boolean)
  const [schematic, setSchematic] = useState(false as boolean)


  useEffect(() => {
    getUsuarioLogueado().then((usuario) => {
      if (usuario != undefined) {
        setUserLogueado(usuario);
        setViolence(usuario.violence);
        setSex(usuario.sex);
        setSkin(usuario.skin);
        setHair(usuario.hair);
        setAac(usuario.aac);
        setAacColor(usuario.aacColor);
        setSchematic(usuario.schematic);
      }
    });
  }, []);

  useEffect(() => {
    ObtenerCategorias(setCategorias);
  }, []);

  const actualizarUsuario = async () => {
    if (userLogueado) {
      let usuario = userLogueado
      usuario.violence = violence;
      usuario.sex = sex;
      usuario.skin = skin;
      usuario.hair = hair;
      usuario.aac = aac;
      usuario.aacColor = aacColor;
      usuario.schematic = schematic;
      usuario.ultimaActualizacion = formatDate(new Date());
      (await db).putOrPatchValue('usuarios', usuario)
      dispatchEvent(new CustomEvent('sincronizar'));
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
                  <br /> <br /> <br />
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="nivel-label">Nivel</InputLabel>
                    <Select
                      labelId="nivel-label"
                      id="nivel-select"
                      value={nivel}
                      label="Nivel"
                      onChange={handleChange}
                    >
                      <MenuItem value={1}>Inicial</MenuItem>
                      <MenuItem value={2}>Intermedio</MenuItem>
                      <MenuItem value={3}>Avanzado</MenuItem>
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
                      />
                    }
                    label="Permitir Contenido violento"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={sex}
                        onChange={(evt) => setSex(evt?.target?.checked)}
                      />
                    }
                    label="Permitir Contenido sexual"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={skin}
                        onChange={(evt) => setSkin(evt?.target?.checked)}
                      />
                    }
                    label="Tiene piel"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={hair}
                        onChange={(evt) => setHair(evt?.target?.checked)}
                      />
                    }
                    label="Tiene pelo"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={aac}
                        onChange={(evt) => setAac(evt?.target?.checked)}
                      />
                    }
                    label="Aac"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={aacColor}
                        onChange={(evt) => setAacColor(evt?.target?.checked)}
                      />
                    }
                    label="Aac Color"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    style={{ alignItems: 'left' }}
                    control={
                      <Checkbox
                        checked={schematic}
                        onChange={(evt) => setSchematic(evt?.target?.checked)}
                      />
                    }
                    label="Esquematico"
                    labelPlacement="end"
                  />
                </FormGroup>
              </Paper>
            </FormControl>

            <br /><br />
            {
              <div>
                <Switch
                  checked={personalizarCategorias}
                  onChange={(evt) => setPersonalizarCategorias(evt?.target?.checked)}
                /> Personalizar Categorias
              </div>
            }
            {
              personalizarCategorias &&
              <div>
                Seleccione las categorías que desea visualizar
                {categorias.length > 0 && (
                  <Filtros
                    // filtros={categorias.sort((a,b) => a.categoriaPadre - b.categoriaPadre)} //TODO ver si este ordenamiento se puede usar como corte
                    filtros = {agruparElementos(categorias, (c => c.categoriaPadre === 0))[0]} 
                    setFiltros={setCategoriasFiltradas}
                    filtro={'Categorias'}
                  />
                )}
              </div>
            }


            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                style={{ alignItems: 'center', margin: '10px' }}
                onClick={async () => {
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
