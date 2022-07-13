import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../model/usuario";

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

export let usuarioLogueado: IUsuario|null = null 

export function setUsuarioLogueado(
  usuario:IUsuario
  ) {
    usuarioLogueado = usuario
  }

export async function ObtenerUsuarios(
  setUsuarios: any
) {
  axios.get(apiPictogramas + '/usuarios')
    .then(response => {
      setUsuarios(response.data)
    })
}

export async function ObtenerUsuario(
  username: string,
  password: string
) {
  return await axios.get(apiPictogramas + '/usuarios/' + username + '/' + password)
    .then(response => {
      console.log('usuario obtenido: ', response.data)
      return response.data
    })
}

export async function CrearUsuario(
  usuario:IUsuario
  ) {
    return await axios.post(apiPictogramas + '/usuarios',
      usuario
    )
    .then((usuario) => {
      return usuario.data
    })
}

export async function ActualizarUsuario(
  usuario:IUsuario
  ) {
    await axios.patch(apiPictogramas + '/usuarios',
    usuario
    )
    .then(() => {
      console.log('creamos un usuario')
    })
}