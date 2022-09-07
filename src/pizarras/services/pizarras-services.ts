import axios from "axios";
import { IPizarra } from "../models/pizarra";

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

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
  pizarra
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