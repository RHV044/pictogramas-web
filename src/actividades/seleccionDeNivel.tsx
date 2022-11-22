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
    <div 
      style={{ 
        width: '100vw',
        height: '100vh',
        backgroundColor: "#e7ebf0" }}>
      <ResponsiveAppBar />
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 10
        }} >
        <Typography
          variant="h5"
          fontFamily="Arial"
          fontWeight="medium"
          align='center'
          color="#00A7E1" >
          Determine la categoría del pictograma
        </Typography>
      </Container>
        <Grid container 
          spacing={5}
          direction="row"
          justifyContent="center"
          alignItems="stretch" >
          <Grid item key={1}>
            <Button
              variant="contained"
              component="label"
              sx={{
                fontFamily:'Arial',
                fontWeight:'bold',
                background: '#00A7E1'}}
              onClick={() => {
                navigate('/actividad/1' + location.search);
              }} >
              Nivel 1
            </Button>
          </Grid>
          <Grid item key={2}>
            <Button
              variant="contained"
              component="label"
              sx={{
                fontFamily:'Arial',
                fontWeight:'bold',
                background: '#00A7E1'}}
              onClick={() => {
                navigate('/actividad/2' + location.search);
              }} >
              Nivel 2
            </Button>
          </Grid>
          <Grid item key={3}>
            <Button
              variant="contained"
              component="label"
              sx={{
                fontFamily:'Arial',
                fontWeight:'bold',
                background: '#00A7E1'}}
              onClick={() => {
                navigate('/actividad/3' + location.search);
              }} >
              Nivel 3
            </Button>
          </Grid>
        </Grid>
    </div>
  );
}


async function validarCantidadCategoriasNivel(cantidadCategoriasMinima: number, usuario: IUsuario) {

  if ((usuario?.nivel !== undefined ? usuario?.nivel : 0) === 3) {
    console.log('VALIDANDO CANTIDAD DE CATEGORIAS');
    IndexedDbService.create().then(async (db) => {
      await db.searchCategoriasPorUsuarioByUser((usuario && usuario.id) ? usuario.id : 0).then(cxus => {
        cxus = cxus.filter(c => !c.pendienteEliminar);
        return cxus.length >= cantidadCategoriasMinima;
      })
    })
  }
  else {
    console.log('no es nivel personlizado');
  }
}