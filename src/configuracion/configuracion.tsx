import ResponsiveAppBar from "../commons/appBar";
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Autocomplete, Button, FormControl, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, Slider, Stack, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { IUsuario } from '../login/model/usuario';
import { IndexedDbService } from '../services/indexeddb-service';
import { useState } from "react";
import { usuarioLogueado } from "../services/usuarios-services";
import { useNavigate } from "react-router-dom";

export default function Configuracion() {

  let navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState(IndexedDbService.create())

  const niveles = ["inicial", "intermedio", "avanzado"]

  return (
    <div>
      <ResponsiveAppBar />
      <Container>
        <FormControl component="fieldset" style={{ width: '50%' }}>
          <FormLabel style={{ padding: 10 }}>
            <h1> <SettingsIcon color="action" /> Configuracion</h1>
          </FormLabel>
          <Paper style={{ width: '100%' }}>
            <Container style={{ padding: 10 }}>
              Nombre <input type="text" defaultValue={usuarioLogueado?.nombreUsuario} /> <br />
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="nivel-label">Nivel</InputLabel>
                <Select
                  labelId="nivel-label"
                  id="nivel-select-helper"
                  // value={age}
                  label="Nivel"
                // onChange={handleChange}
                >                  
                  <MenuItem value={10}>Básico</MenuItem>
                  <MenuItem value={20}>Intermedio</MenuItem>
                  <MenuItem value={30}>Avanzado</MenuItem>
                </Select>                
              </FormControl>

            </Container>
            <FormGroup aria-label="center" style={{ paddingRight: 10 }}>
              <FormControlLabel
                style={{ alignItems: 'left' }}
                control={
                  <Switch />
                }
                label="Permitir Contenido violento"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch />
                }
                label="Permitir Contenido sexual"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch />
                }
                label="Tiene piel"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch />
                }
                label="Tiene pelo"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch />
                }
                label="Aac"
                labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Switch />
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
          >Guardar</Button>
          <Button
            variant="outlined"
            style={{ alignItems: 'center', margin: '10px' }}
            onClick={() => {
              navigate('../pictogramas');
            }}
          >Cancelar</Button>
        </Stack>

      </Container>
    </div>
  )
}