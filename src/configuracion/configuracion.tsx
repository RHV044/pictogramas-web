import ResponsiveAppBar from '../commons/appBar';
import SettingsIcon from '@mui/icons-material/Settings';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
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
import { useLocation, useNavigate } from 'react-router-dom';
import { Console } from 'console';
import Filtros from '../pictogramas/components/filtros';
import { ICategoria } from '../pictogramas/models/categoria';
import { formatDate, ObtenerCategorias } from '../pictogramas/services/pictogramas-services';
import React from 'react';
import FormDialogValidarAcceso from './components/validarCambioConfiguracion';
import imagenUsuario from '../commons/imagen-usuario.jpg'

function agruparElementos(datos, predicado) : ICategoria[] { //agrupar categorias por algun campo en particular

  return datos.reduce((a, v, i) => (a[predicado(v, i) ? 0 : 1].push(v), a), [[], []]);
}

export default function Configuracion() {
  let navigate = useNavigate();
  let location = useLocation();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState(IndexedDbService.create());
  const [categorias, setCategorias] = useState([] as ICategoria[]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(
    [] as ICategoria[]
  );

  const [personalizarCategorias, setPersonalizarCategorias] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    
    setNivel(event.target.value as string);

    if(Number(nivel) === 3){
        setPersonalizarCategorias(true)
    } else {
      setPersonalizarCategorias(false)
    }
    if (userLogueado !== null)
      userLogueado.nivel = Number(nivel) 
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

  const [file, setFile] = useState("" as string)

  const niveles = ["Inicial","Intermedio","Avanzado", "Personalizado"];

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
      else{
        navigate('/cuenta/seleccionar' + location.search);
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
      usuario.ultimaActualizacion = new Date().toISOString();
      usuario.nivel = Number(nivel);
      (await db).putOrPatchValue('usuarios', usuario)
      dispatchEvent(new CustomEvent('sincronizar'));
    };
  }

  function guardarImagenBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if(reader.result && userLogueado){
        var fechaActualizacion = new Date().toISOString()
        userLogueado.ultimaActualizacion = fechaActualizacion;
        userLogueado.imagen = reader.result.toString()
        IndexedDbService.create().then(async (db) => {      
          await db.putOrPatchValue("usuarios", userLogueado)
          dispatchEvent(new CustomEvent('sincronizar'));
        })
      }
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
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
                  <Card                        
                    sx={{ maxWidth: 245 }}               
                    style={{ marginTop: '5px' }}
                    onClick={() => {
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        src={userLogueado && userLogueado.imagen && userLogueado.imagen !== "" ? userLogueado.imagen : imagenUsuario}
                        alt={userLogueado.nombreUsuario}
                      >
                      </CardMedia>
                      <CardHeader title={userLogueado.nombreUsuario}></CardHeader>
                      <CardContent></CardContent>
                    </CardActionArea>
                  </Card>
                  <Button variant="contained" component="label">
                    Adjuntar Imagen para Usuario
                    <input type="file" hidden 
                    onChange={(evt) => { 
                      if (evt.target.files){
                        guardarImagenBase64(evt.target.files[0]) 
                      }          
                      console.log(file)
                    }}/>
                  </Button>
                  <br></br>
                  <br></br>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="nivel-select-label">{niveles[Number(nivel)]}</InputLabel>
                    <Select
                      labelId="nivel-select-label"
                      id="nivel-select"                      
                      value={nivel}                      
                      label="Nivel"
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value={0}>{niveles[0]}</MenuItem>
                      <MenuItem value={1}>{niveles[1]}</MenuItem>
                      <MenuItem value={2}>{niveles[2]}</MenuItem>
                      <MenuItem value={3}>{niveles[3]}</MenuItem> 

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
                  disabled
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
