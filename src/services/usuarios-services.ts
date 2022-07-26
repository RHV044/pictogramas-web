import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../login/model/usuario";
import { ICategoria } from "../pictogramas/models/categoria";

var CryptoJS = require("crypto-js");
const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";
const encryptKey = process.env.ENCRYPT_KEY ?? "8080808080808080";

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
    let user = {nombreUsuario: usuario.nombreUsuario, password : usuario.password} as IUsuario
    user.password = CryptoJS.AES.encrypt(user.password, encryptKey,
      {
        iv: encryptKey
      }
    ).toString()
    console.log(user.password)
    return await axios.post(apiPictogramas + '/usuarios',
      usuario
    )
    .then((resp) => {
      return resp.data
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

export async function SubirPictograma(
  usuario: any,
  keyword: string,
  file: any,
  fileName: string,
  fileBase64: any,
  categoriasFiltradas: ICategoria[],
  filtros: any
){
  const body = {
    Schematic: filtros.esquematico,
    Sex: filtros.sexual,
    Violence: filtros.violento,
    Aac: filtros.aac,
    AacColor: filtros.aacColor,
    Skin: filtros.skin,
    Hair: filtros.hair,
    CategoriasFiltradas: categoriasFiltradas, 
    FileName: fileName,
    File: fileBase64,
    Keyword: keyword
  }
  return await axios.post(apiPictogramas + `/usuarios/${usuario}/pictogramas`,
    body,
    {
      headers: {
          'content-type': 'application/json'
      }
    }
    )
    .then(response => {
      return response.data
    })
}