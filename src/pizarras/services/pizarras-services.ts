import axios from "axios";
import { IPizarra } from "../models/pizarra";

const apiPictogramas = process.env.REACT_APP_URL_PICTOGRAMAS ?? "http://localhost:5000";

export async function ObtenerPizarras(usuarioId: number){
  return await axios.get(apiPictogramas + '/pizarras/' + usuarioId)
  .then((resp) => {
    return resp.data
  })
}

export async function GuardarPizarra(pizarra: IPizarra){
  console.log("pizarra a guardar: ", pizarra)
  return await axios.post(apiPictogramas + '/pizarras/',
  pizarra
  )
  .then((resp) => {
    return resp.data
  })
}

export async function ActualizarPizarra(pizarra: IPizarra){
  console.log("pizarra a guardar: ", pizarra)
  return await axios.put(apiPictogramas + '/pizarras/',
  {
    Id: pizarra.id,
    Filas: pizarra.filas,
    Columnas: pizarra.columnas,
    UsuarioId: pizarra.usuarioId,
    Nombre: pizarra.nombre,
    Celdas: pizarra.celdas
  },
  {
    headers: {
      'content-type': 'application/json',
    },
  }
  )
  .then((resp) => {
    return resp.data
  })
}

export async function EliminarPizarra(pizarra: IPizarra){
  console.log("pizarra a guardar: ", pizarra)
  return await axios.delete(apiPictogramas + '/pizarras/' + pizarra.id
  )
  .then((resp) => {
    return resp.data
  })
}