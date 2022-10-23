import { Button, Grid, Typography, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../commons/appBar";
import { actividadesStyle } from './actividadesStyle'

export default function SeleccionDeNivel() {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <div>
      <ResponsiveAppBar />
      <Container>
      <Typography variant="h5" gutterBottom >
        Juego de Categorizar los Pictogramas
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 10, md: 12 }}
        style={{ marginTop: 5, position: 'relative' }}
      >
        <Grid
          key={1}
          item
          xs={12}
          sm={4}
          md={2}
        >
          <Button style={{ marginLeft: 5, marginRight: 5 }} variant="contained" component="label" onClick={() => {
            navigate('/actividad/1' + location.search);
          }}>
            Nivel 1
      </Button>
        </Grid>
        <Grid
          key={2}
          item
          xs={12}
          sm={4}
          md={2}
        >
          <Button style={{ marginLeft: 5, marginRight: 5 }} variant="contained" component="label" onClick={() => {
            navigate('/actividad/2' + location.search);
          }}>
            Nivel 2
      </Button>
        </Grid>
        <Grid
          key={3}
          item
          xs={12}
          sm={4}
          md={2}
        >
          <Button style={{ marginLeft: 5, marginRight: 5 }} variant="contained" component="label" onClick={() => {
            navigate('/actividad/3' + location.search);
          }}>
            Nivel 3
      </Button>
        </Grid>
      </Grid >
      </Container>
    </div >
  )
}