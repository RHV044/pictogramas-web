import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../commons/appBar";

export default function SeleccionDeNivel(){
  let navigate = useNavigate();
  let location = useLocation();

  return(
    <div>
      <ResponsiveAppBar />
      Juego de Categorizar los Pictogramas
      <br/>
      Seleccione el Nivel
      <br/>
      <Button style={{marginLeft: 5, marginRight: 5}} variant="contained" component="label" onClick={() => {
        navigate('/actividad/1' + location.search);
      }}>        
        Nivel 1
      </Button>
      <br/>
      <Button style={{marginLeft: 5, marginRight: 5}} variant="contained" component="label" onClick={() => {
        navigate('/actividad/2' + location.search);
      }}>        
        Nivel 2
      </Button>
      <br/>
      <Button style={{marginLeft: 5, marginRight: 5}} variant="contained" component="label" onClick={() => {
        navigate('/actividad/3' + location.search);
      }}>        
        Nivel 3
      </Button>
    </div>
  )
}