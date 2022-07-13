
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CrearUsuario } from '../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
const db = new IndexedDbService();

const CrearCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <form className="form">
        <TextField id="filled-basic" label="Usuario" variant="filled" 
          value={username} onChange={(evt) => {setUsername(evt.target.value)}} />
        <TextField id="filled-basic" label="Contraseña" variant="filled" 
          value={password} onChange={(evt) => {setPassword(evt.target.value)}}/>
        <Button type="button" color="primary" className="form__custom-button"
          onClick={async () => {
            let usuario = await CrearUsuario({nombreUsuario: username, password: password})
            await db.putOrPatchValue("usuarios", usuario)            
            navigate("/cuenta/seleccionar" + location.search);
          }}
        >
          Crear Cuenta
        </Button>
      </form>
    </div>
  );
}

export default CrearCuenta