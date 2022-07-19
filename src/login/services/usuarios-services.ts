import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../model/usuario";

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";
const encryptKey = process.env.ENCRYPT_KEY ?? "WmZq4t7weShVmYq3KaPdSgVk*G-JaNdRz%C*F)J@6w9z$C&Fp3s6v9y$UkXp2s5vcRfUjXn2H@McQfTj";

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
  var AES = require("crypto-js/aes");
  let usuario = {nombreUsuario : username, password: AES.encrypt(password, encryptKey)}
  return await axios.put(apiPictogramas + '/usuarios', 
    usuario
  )
    .then(response => {
      console.log('usuario obtenido: ', response.data)
      return response.data
    })
}

export async function CrearUsuario(
  usuario:IUsuario  
  ) {
    var AES = require("crypto-js/aes");
    usuario.password = AES.encrypt(usuario.password, encryptKey);
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
    var AES = require("crypto-js/aes");
    usuario.password = AES.encrypt(usuario.password, encryptKey);
    await axios.patch(apiPictogramas + '/usuarios',
    usuario
    )
    .then(() => {
      console.log('creamos un usuario')
    })
}