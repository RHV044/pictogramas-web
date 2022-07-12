
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CrearUsuario } from '../services/usuarios-services';

const VincularCuenta = (props: any) => {

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
            // Se debe registrar nada mas en el indexdbb
            CrearUsuario({nombreUsuario: usuario, password: password})
            navigate("/cuenta/seleccionar" + location.search);
          }}
        >
          Vincular Cuenta
        </Button>
      </form>
    </div>
  );
}

export default VincularCuenta