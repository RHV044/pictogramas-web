
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CrearUsuario } from '../services/usuarios-services';

const AgregarCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <form className="form">
        <TextField id="filled-basic" label="Usuario" variant="filled" 
          value={usuario} onChange={(evt) => {setUsuario(evt.target.value)}} />
        <TextField id="filled-basic" label="Contraseña" variant="filled" 
          value={password} onChange={(evt) => {setPassword(evt.target.value)}}/>
        <Button type="button" color="primary" className="form__custom-button"
          onClick={() => {
            CrearUsuario({username: usuario, password: password})
            //props.setUsuario(usuario); //TODO: Como se usa redux con Typescript?
            navigate("/cuenta/seleccionar" + location.search);
          }}
        >
          Agregar Cuenta
        </Button>
      </form>
    </div>
  );
}

export default AgregarCuenta