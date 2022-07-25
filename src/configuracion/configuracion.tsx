import ResponsiveAppBar from "../commons/appBar";
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function Configuracion(){

  return(
    <div>
      <ResponsiveAppBar />
      <div >
        <h1> <SettingsIcon color="action"/> Configuracion</h1>
        <FormGroup>
          <FormControlLabel
            control = {
                 <Switch/>
            } label= "Permitir Contenido violento"
          />
          <FormControlLabel
            control = {
                 <Switch/>
            } label= "Permitir Contenido sexual"
          />
          <FormControlLabel
            control = {
                 <Switch/>
            } label= "Skin"
          />
          <FormControlLabel
            control = {
                 <Switch/>
            } label= "Hair"
          />
          
        </FormGroup>
        

      </div>
      
    </div>
  )
}