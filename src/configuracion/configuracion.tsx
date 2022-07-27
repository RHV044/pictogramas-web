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

        <Grid container>
          <Grid item md={12}>
            <FormControl component="fieldset">
              <FormLabel>
                <h1> <SettingsIcon color="action" /> Configuracion</h1>
              </FormLabel>
              <Paper>
                Nombre <input type="text" defaultValue={usuarioLogueado?.nombreUsuario} /> <br/>
                <Autocomplete id="select-nivel" 
                options={niveles} 
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nivel"
                  />
                )}
                />
                <FormGroup aria-label="center">
                  <FormControlLabel
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
          </Grid>
          <Grid item md={12}>
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
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}