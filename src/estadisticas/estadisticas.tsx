import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ResponsiveAppBar from '../commons/appBar';
import {
  getUsuarioLogueado,
  ObtenerEstadisticas,
} from '../services/usuarios-services';
import CategoriasMasUtilizadas from './categoriasMasUtilizadas';
import PictogramasMasUtilizados from './pictogramasMasUtilizados';
import TimeLine from './timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Estadisticas() {
  const [estadisticas, setEstadisticas] = useState(null as any);

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
    getUsuarioLogueado().then((usuario) => {
      ObtenerEstadisticas(usuario?.id).then((est) => {
        setEstadisticas(est);
      });
    });
  }, []);

  return (
    <div
      style={{ 
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: "#e7ebf0" }}>
      <ResponsiveAppBar />
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
       <Typography
          variant="h5"
          fontFamily="Arial"
          fontWeight="medium"
          align='center'
          color="#00A7E1" >
          Estadísticas de uso
        </Typography>
      </Box>
      {estadisticas && (
        <>
          <Container maxWidth="xl">
            <Accordion>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" gutterBottom>
                    Pictogramas Mas Utilizados
                  </Typography>
                </AccordionSummary>
              </Box>
              <AccordionDetails>
                <Box sx={{ display: 'flex' }}>
                  <PictogramasMasUtilizados
                    pictogramas={estadisticas.pictogramasMasUtilizados}
                  />
                </Box>

                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    marginTop: 5,
                  }}
                >
                  <Typography variant="button" display="block" gutterBottom>
                    Total Pictogramas distintos utilizados:{' '}
                    {estadisticas.cantidadDePictogramasDistintosUtilizados}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Container>
          <Container maxWidth="xl">
            <Accordion style={{ marginTop: 20 }}>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" gutterBottom>
                    Categorias Mas Utilizadas
                  </Typography>
                </AccordionSummary>
              </Box>
              <AccordionDetails>
                <Box sx={{ display: 'flex' }}>
                  <CategoriasMasUtilizadas
                    categorias={estadisticas.categoriasMasUtilizadas}
                  />
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    marginTop: 5,
                  }}
                >
                  <Typography variant="button" display="block" gutterBottom>
                    Total Categorias distintas utilizadas:{' '}
                    {estadisticas.cantidadDeCategoriasDistintasUtilizadas}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Container>
          <Container maxWidth="xl">
            <Accordion style={{ marginTop: 20 }}>
              <Box
                style={{
                  display: 'flex',
                  // alignItems: 'center',
                  // justifyContent: 'center',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" gutterBottom>
                    Pictogramas mas utilizados por rangos horarios
                  </Typography>
                </AccordionSummary>
              </Box>
              <AccordionDetails>
                <TimeLine estadisticas={estadisticas.todasLasEstadisticas} />
              </AccordionDetails>
            </Accordion>
          </Container>
        </>
      )}
    </div>
  );
}
