import { useEffect, useState } from "react";
import ResponsiveAppBar from "../commons/appBar";
import { getUsuarioLogueado, ObtenerEstadisticas } from "../services/usuarios-services";

export default function Estadisticas(){
  const [estadisticas, setEstadisticas] = useState([] as  any[])

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
    getUsuarioLogueado().then(usuario => {ObtenerEstadisticas(usuario?.id).then(est => {
        setEstadisticas(est)
      })
    })
  }, [])

  return(
    <div>
      <ResponsiveAppBar />
      Estadisticas
    </div>
  )
}