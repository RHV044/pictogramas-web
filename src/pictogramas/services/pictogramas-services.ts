import axios from "axios";
import { stringify } from "querystring";


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
