import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ResponsiveAppBar from '../commons/appBar';
import {
  getUsuarioLogueado,
  ObtenerEstadisticas,
} from '../services/usuarios-services';
import CategoriasMasUtilizadas from './categoriasMasUtilizadas';
import PictogramasMasUtilizados from './pictogramasMasUtilizados';
import TimeLine from './timeline';

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
    <div>
      <ResponsiveAppBar />
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Estadisticas
        </Typography>
      </Box>
      {estadisticas && (
        <>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pictogramas Mas Utilizados
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <PictogramasMasUtilizados
              pictogramas={estadisticas.pictogramasMasUtilizados}
            />
          </Box>

          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Pictogramas distintos utilizados:{' '}
              {estadisticas.cantidadDePictogramasDistintosUtilizados}
            </Typography>
          </Box>

          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Categorias Mas Utilizadas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <CategoriasMasUtilizadas
              categorias={estadisticas.categoriasMasUtilizadas}
            />
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Categorias distintas utilizadas:{' '}
              {estadisticas.cantidadDeCategoriasDistintasUtilizadas}
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pictogramas mas utilizados por rangos horarios
            </Typography>
          </Box>
          <TimeLine estadisticas={estadisticas.todasLasEstadisticas} />
        </>
      )}
    </div>
  );
}
