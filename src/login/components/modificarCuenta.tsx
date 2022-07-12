
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { IndexedDbService } from '../../services/indexeddb-service';
import { IUsuario } from '../model/usuario';
import { ActualizarUsuario, usuarioLogueado } from '../services/usuarios-services';
const db = new IndexedDbService();

const ModificarCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [usuario, setUsuario] = useState(usuarioLogueado as IUsuario);

  return (
    <div className="App">
      <form className="form">
        <TextField id="filled-basic" label="Usuario" variant="filled" 
          value={usuario.nombreUsuario} disabled={true}/>
        <TextField id="filled-basic" label="Contraseña" variant="filled" 
          onChange={(evt) => {
              usuario.password = evt.target.value
            }}/>
        <Button type="button" color="primary" className="form__custom-button"
          onClick={() => {
            // TODO: Solo actualiza el usuario en la base, es necesario actualizar en el indexdbb?
            ActualizarUsuario(usuario)
            navigate("/cuenta/seleccionar" + location.search);
          }}
        >
          Cambiar Contrasela
        </Button>
      </form>
    </div>
  );
}

export default ModificarCuenta