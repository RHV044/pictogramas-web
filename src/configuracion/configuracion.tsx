import ResponsiveAppBar from "../commons/appBar";
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Autocomplete, Button, FormControl, FormLabel, Grid, Paper, Slider, Stack, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { IUsuario } from '../login/model/usuario';
import { IndexedDbService } from '../services/indexeddb-service';
import { useState } from "react";
import { usuarioLogueado } from "../services/usuarios-services";
import { useNavigate } from "react-router-dom";

export default function Configuracion() {

  let navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([] as IUsuario[]);
  const [db, setDb] = useState (IndexedDbService.create())

  const niveles = ["inicial", "intermedio", "avanzado"]

  return (
    <div>
      <ResponsiveAppBar />
      <Container>
            <FormControl component="fieldset" style={{width: '50%'}}>
              <FormLabel style={{padding: 10}}>
                <h1> <SettingsIcon color="action" /> Configuracion</h1>
              </FormLabel>
              <Paper style={{width: '100%'}}>
                <Container style={{padding: 10}}>
                Nombre <input type="text" defaultValue={usuarioLogueado?.nombreUsuario} /> <br/>
                <Autocomplete id="select-nivel" 
                options={niveles} 
                style={{padding: 10}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nivel"
                  />
                )}
                />
                </Container>
                <FormGroup aria-label="center" style={{paddingRight: 10}}>
                  <FormControlLabel
                    style={{alignItems: 'left'}}
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