
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const ModificarCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [usuario, setUsuario] = useState("");

  return (
    <div className="App">
      <form className="form">
        <TextField id="filled-basic" label="Usuario" variant="filled" 
          value={usuario} onChange={(evt) => {setUsuario(evt.target.value)}} disabled={true}/>
        <TextField id="filled-basic" label="Contraseña" variant="filled" />
        <Button type="button" color="primary" className="form__custom-button"
          onClick={() => {
            //props.setUsuario(usuario); //TODO: Como se usa redux con Typescript?
            navigate("/pictogramas" + location.search);
          }}
        >
          Cambiar Contrasela
        </Button>
      </form>
    </div>
  );
}

export default ModificarCuenta