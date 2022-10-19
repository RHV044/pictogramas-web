import { useEffect } from "react";
import ResponsiveAppBar from "../commons/appBar";

export default function Estadisticas(){

  useEffect(() => {
    dispatchEvent(new CustomEvent('sincronizar'));
  }, [])

  return(
    <div>
      <ResponsiveAppBar />
      Estadisticas
    </div>
  )
}