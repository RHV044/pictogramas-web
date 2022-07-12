import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../model/usuario";

const apiArasaac = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

export let usuarioLogueado: IUsuario|null = null 

export function setUsuarioLogueado(
  usuario:IUsuario
  ) {
    usuarioLogueado = usuario
  }

export async function ObtenerUsuarios(
  setUsuarios: any
) {
  axios.get(apiArasaac + '/usuarios')
    .then(response => {
      console.log('obtuvimos los usuarios')
      console.log(response.data)
      setUsuarios(response.data)
    })
  //setUsuarios([{id: 1, username: 'gvaquero', password: '123'},{id: 2, username: 'leo', password: '123'}])
}

export async function CrearUsuario(
  usuario:IUsuario
  ) {
    axios.post(apiArasaac + '/usuarios',
    usuario
    //  stringify(usuario),
    //  {
    //   headers: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //      }
    //   }
    )
    .then(() => {
      console.log('creamos un usuario')
    })
}

export async function ActualizarUsuario(
  usuario:IUsuario
  ) {
    axios.patch(apiArasaac + '/usuarios',
    usuario
    )
    .then(() => {
      console.log('creamos un usuario')
    })
}