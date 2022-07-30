import axios from "axios";
import { stringify } from "querystring";
import { IndexedDbService } from "../../services/indexeddb-service";
import { usuarioLogueado } from "../../services/usuarios-services";
import { ICategoria } from "../models/categoria";
import { IPictogram } from "../models/pictogram";

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

export async function ObtenerCategorias(
  setCategorias: any
) {
  let db = await IndexedDbService.create();
  let categorias = await db.getAllValues('categorias');
  if (categorias){
    return await setCategorias(categorias)
  }
  else{
    return await axios.get(apiPictogramas + '/categorias')
    .then(response => {
      setCategorias(response.data)
    })
  }
}

export async function ObtenerYGuardarCategorias(
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
  let db = await IndexedDbService.create();
  let pictogramas = await db.getAllValues('pictograms');
  if (pictogramas){
    let pictogramasFiltrados = pictogramas.filter((p: IPictogram) => p.categorias && p.categorias.some((c: ICategoria) => c.id == categoria))
    // pictogramasFiltrados.forEach(async (p: IPictogram) => {
    //   let imagen = (await db.getValue('imagenes', p.id)).imagen
    //   p.imagen = imagen
    // })
    for(var i=0; i<pictogramasFiltrados.length; ++i)
      pictogramasFiltrados[i].imagen = (await db.getValue('imagenes', pictogramasFiltrados[i].id)).imagen

    return await setPictogramas(pictogramasFiltrados)
  }
  else {
  return await axios.get(apiPictogramas + '/pictogramas/categorias/id/'+ categoria)
    .then(response => {
      console.log('pictogramas por categoria: ', response.data)
      setPictogramas(response.data)
    })
  }
}

export async function ObtenerImagen(
  pictograma: number
){
  return await (await axios.get(apiPictogramas + '/pictogramas/' + pictograma +'/obtener')).data
}

export async function ObtenerImagenAsBlob(
  pictograma: IPictogram
){
  axios.get(`${apiPictogramas}/pictogramas/${pictograma.id}/obtener`, {
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
  let url: string;
  if(usuarioLogueado != null && usuarioLogueado.id != null)
    url = '/pictogramas/total?UsuarioId=' + usuarioLogueado.id 
  else 
    url = '/pictogramas/total'
  return await axios.get(apiPictogramas + url)
    .then(response => {
      return response.data
    })
}

export async function ObtenerInformacionPictogramas(){
  let url: string;
  if(usuarioLogueado != null && usuarioLogueado.id != null)
    url = '/pictogramas/informacion?UsuarioId=' + usuarioLogueado.id 
  else 
    url = '/pictogramas/informacion'
  return await axios.get(apiPictogramas + url)
    .then(response => {
      return response.data
    })
}


