import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../commons/appBar";
import { getUsuarioLogueado, ObtenerEstadisticas } from "../services/usuarios-services";
import CategoriasMasUtilizadas from "./categoriasMasUtilizadas";
import PictogramasMasUtilizados from "./pictogramasMasUtilizados";
import TimeLine from "./timeline";

export default function Estadisticas(){
  const [estadisticas, setEstadisticas] = useState(null as  any)

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
    getUsuarioLogueado().then(usuario => {ObtenerEstadisticas(usuario?.id).then(est => {
        setEstadisticas(est)
      })
    })
  }, [])

  return (
    <div>
      <ResponsiveAppBar />
      Estadisticas
      {estadisticas && (
        <>
          <Box sx={{ display: 'flex' }}>
            Pictogramas Mas Utilizados
            <PictogramasMasUtilizados pictogramas={estadisticas.pictogramasMasUtilizados} />
          </Box>
          <Box sx={{ display: 'flex' }}> Total Pictogramas distintos utilizados: {estadisticas.cantidadDePictogramasDistintosUtilizados} </Box>
          <Box sx={{ display: 'flex' }}>
            Categorias Mas Utilizadas
            <CategoriasMasUtilizadas categorias={estadisticas.categoriasMasUtilizadas}/>
          </Box>
          <Box sx={{ display: 'flex' }}> Total Categorias distintas utilizadas: {estadisticas.cantidadDeCategoriasDistintasUtilizadas} </Box>
          {/* TODO: Podriamos ver de mostrar alguna rutina que se repita */}
          <TimeLine estadisticas={estadisticas.todasLasEstadisticas}/>
        </>
      )}
    </div>
  );
}