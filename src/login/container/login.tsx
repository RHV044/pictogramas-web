import { setUsuario } from "../../redux/actions/action-creators";
import Login from "../components/login";
import { connect } from "react-redux"

function mapDispatchToProps(dispatch: (arg0: { type: string; payload: { nombreUsuario: any; }; }) => void){
  return {
    setUsuario : (usuario: any) => {
        let accion = setUsuario(usuario);
        dispatch (accion);
    }
  }
}

export default connect(null, mapDispatchToProps)(Login)