import axios from "axios";
import { stringify } from "querystring";


const apiArasaac = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

export async function ObtenerCategorias(
  setCategorias: any
) {
  return await axios.get(apiArasaac + '/categorias')
    .then(response => {
      setCategorias(response.data)
    })
}
