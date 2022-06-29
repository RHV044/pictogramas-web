
import { Button, TextField } from '@mui/material';
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function Login({

}: {

}) {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <div className="App">
      <form className="form">
        <TextField id="filled-basic" label="Usuario" variant="filled" />
        <TextField id="filled-basic" label="Contraseña" variant="filled" />
        <Button type="button" color="primary" className="form__custom-button"
          onClick={() => {
            navigate("/pictogramas" + location.search);
          }}
        >
          Log in
        </Button>
      </form>
    </div>
  );
}