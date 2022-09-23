
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CrearUsuario } from '../../services/usuarios-services';
import { IndexedDbService } from '../../services/indexeddb-service';
import { IUsuario } from '../model/usuario';

const CrearCuenta = (props: any) => {

  let navigate = useNavigate();
  let location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  async function crearUsuario(){
    let usuario = {
      nombreUsuario: username, 
      password: password, 
      aac:false, 
      aacColor: false, 
      hair: false, 
      sex: false, 
      skin:false, 
      violence: false, 
      schematic: false,
      nivel: 0, 
    } as IUsuario    
    // La creacion del usuario es online, de esta manera se obtiene id desde la api
    await CrearUsuario(usuario).then(user => {
      IndexedDbService.create().then(async (db) => {
        console.log("user creado: ", user)
        await db.putOrPatchValue("usuarios", user)        
        navigate("/cuenta/seleccionar" + location.search);
      })
    })
  }

  return (
    <div className="App">
      <form className="form">
        <TextField id="filled-basic" label="Usuario" variant="filled" 
          value={username} onChange={(evt) => {setUsername(evt.target.value)}} />
        <TextField id="filled-basic" label="Contraseña" variant="filled" 
          type={showPassword ? "text" : "password"}
          value={password} onChange={(evt) => {setPassword(evt.target.value)}}/>
        <Button type="button" color="primary" className="form__custom-button"
          onClick={async () => {
            await crearUsuario()
          }}
        >
          Crear Cuenta
        </Button>
      </form>
    </div>
  );
}

export default CrearCuenta