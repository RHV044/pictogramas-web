import ResponsiveAppBar from "../commons/appBar";
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button, FormControl, FormLabel, Grid, Stack } from "@mui/material";
import { Container } from "@mui/system";

export default function Configuracion() {

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
                  label="TIene piel"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                    <Switch />
                  }
                  label="Tiene pelo"
                  labelPlacement="start"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item md={12}>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              style={{ alignItems: 'center', margin: '10px' }}
            >Aceptar</Button>
            <Button
              variant="outlined"
              style={{ alignItems: 'center', margin: '10px' }}
            >Cancelar</Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}