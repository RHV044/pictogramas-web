import axios from "axios";
import { stringify } from "querystring";
import { IPictogram } from "../models/pictogram";


const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

export async function ObtenerCategorias(
  setCategorias: any
) {
  return await axios.get(apiPictogramas + '/categorias')
    .then(response => {
      setCategorias(response.data)
    })
}

export async function ObtenerPictogramasPorCategoria(
  setPictogramas: any,
  categoria: number
) {
  return await axios.get(apiPictogramas + '/pictogramas/categorias/id/'+ categoria)
    .then(response => {
      console.log('pictogramas por categoria: ', response.data)
      setPictogramas(response.data)
    })
}

export async function ObtenerImagen(
  pictograma: number
){
  return await (await axios.get(apiPictogramas + '/pictogramas/' + pictograma +'/obtener')).data
}

export async function ObtenerImagenAsBlob(
  pictograma: IPictogram
){
  axios.get(`${apiPictogramas}/pictogramas/${pictograma}/obtener`, {
    headers: {
      Accept: "image/png",
    },
    responseType: "blob",
  }).then(response => {    
    pictograma.blob = response.data
    console.log('se obtuvo el blob: ', pictograma.blob)
  })
}

export async function ObtenerTotalCategorias(){
  return await axios.get(apiPictogramas + '/categorias/total')
    .then(response => {
      return response.data
    })
}

export async function ObtenerTotalPictogramas(){
  return await axios.get(apiPictogramas + '/pictogramas/total')
    .then(response => {
      return response.data
    })
}


