import { ACT_SET_USUARIO } from "./action-types";

export function setUsuario(nombreUsuario: any){
    return {
        type: ACT_SET_USUARIO,
        payload: { nombreUsuario }
    }
}