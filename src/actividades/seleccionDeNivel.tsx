import { Button, Grid, Typography, Container } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../commons/appBar';
import { IUsuario } from '../login/model/usuario';
import { IndexedDbService } from '../services/indexeddb-service';
import { getUsuarioLogueado } from '../services/usuarios-services';

export default function SeleccionDeNivel() {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <div>
      <ResponsiveAppBar />
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Juego de Categorizar los Pictogramas
        </Typography>
      </Container>
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 10, md: 12 }}
          style={{ marginTop: 2, position: 'relative', marginLeft: 30 }}
        >
          <Grid key={1} item xs={12} sm={4} md={2}>
            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              variant="contained"
              component="label"
              onClick={() => {
                navigate('/actividad/1' + location.search);
              }}
            >
              Nivel 1
            </Button>
          </Grid>
          <Grid key={2} item xs={12} sm={4} md={2}>
            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              variant="contained"
              component="label"
              onClick={() => {
                navigate('/actividad/2' + location.search);
              }}
            >
              Nivel 2
            </Button>
          </Grid>
          <Grid key={3} item xs={12} sm={4} md={2}>
            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              variant="contained"
              component="label"
              onClick={() => {
                navigate('/actividad/3' + location.search);
              }}
            >
              Nivel 3
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}


async function validarCantidadCategoriasNivel(cantidadCategoriasMinima: number, usuario : IUsuario){

      if ((usuario?.nivel !== undefined ? usuario?.nivel : 0) === 3) {
        console.log('VALIDANDO CANTIDAD DE CATEGORIAS');
        IndexedDbService.create().then(async (db) => {
          await db.searchCategoriasPorUsuarioByUser((usuario && usuario.id) ? usuario.id : 0).then(cxus => {
            cxus = cxus.filter(c => !c.pendienteEliminar);
            return cxus.length >= cantidadCategoriasMinima;  
          })})
      }
      else {
        console.log('no es nivel personlizado');
      }    
}