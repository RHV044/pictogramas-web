import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../../login/model/usuario";
import { IndexedDbService } from "../../services/indexeddb-service";
import { getUsuarioLogueado, usuarioLogueado } from "../../services/usuarios-services";
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

export async function ObtenerPictogramas(
) {
  let db = await IndexedDbService.create();
  let pictogramas = await db.getAllValues('pictograms');
  let pictogramasPropios = await db.getAllValues('pictogramasPropios');
  pictogramas.concat(pictogramasPropios)
  return pictogramas
}

export async function ObtenerCategoriasIndexDB(
  ) {
    let db = await IndexedDbService.create();
    let categorias = await db.getAllValues('categorias');
    return categorias
  }

export async function ObtenerPictogramasPorCategoria(
  setPictogramas: any,
  categoria: number
) {
  let db = await IndexedDbService.create();

  // Alternativa - Buscar por indice con la categoria
  // TODO: categorias es un array de objetos id, nombre
  // Como hago para buscar con este indice?
  //let categ = await db.getValue('categorias', categoria)
  //let pictogramas = await db.getPictogramasPorIndice(categ)
  //console.log('Pictogramas filtrados 1: ', pictogramas)
  // Actual 
  let pictogramas = await db.getAllValues('pictograms');
  let pictogramasPropios = await db.getAllValues('pictogramasPropios');
  pictogramas.concat(pictogramasPropios)
  //console.log('Pictogramas filtrados 2: ', pictogramas)

  let usuario = await getUsuarioLogueado();

  if(categoria === -1)
  {
    return await setPictogramas(pictogramas.filter(p => p.IdUsuario === usuario?.id))
  }

  if(usuario != null && usuario !== undefined && usuario.id != null)
    pictogramas = pictogramas.filter(p => (p.IdUsuario === null || p.IdUsuario === usuario?.id || p.idArasaac !== null))
  else
    pictogramas = pictogramas.filter(p => (p.IdUsuario === null || p.idArasaac !== null))
  if (pictogramas){
    let pictogramasFiltrados = pictogramas.filter((p: IPictogram) => p.categorias && p.categorias.some((c: ICategoria) => c.id === categoria))
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

export async function ObtenerTotalPictogramas() {
  let url: string;
  let usuario = await getUsuarioLogueado();
  if (usuario != null && usuario.id != null)
    url = '/pictogramas/total?UsuarioId=' + usuario.id;
  else 
    url = '/pictogramas/total';
  return await axios.get(apiPictogramas + url).then((response) => {
    return response.data;
  });
}

export async function ObtenerInformacionPictogramas() {
  let url: string;
  let usuario = await getUsuarioLogueado();
  if (usuario != null && usuario.id != null)
    url = '/pictogramas/informacion?UsuarioId=' + usuario.id;
  else 
    url = '/pictogramas/informacion';
  return await axios.get(apiPictogramas + url).then((response) => {
    return response.data;
  });
}

export async function ObtenerInterpretacionNatural(textoOriginal: string){
  return await axios.post(apiPictogramas + '/interpretacion',
    {"Texto": textoOriginal}
  )
  .then((resp) => {
    return resp.data
  })
}

export async function GuardarPictogramaFavorito(idPictograma: number) {
  let usuario = await getUsuarioLogueado();
  if (usuario != null && usuario.id != null && usuario != undefined){
    return await axios.post(apiPictogramas + '/pictogramas/favoritos/' + usuario.id + '/' + idPictograma).then((resp) => {
      return resp.data
    });
  } else {
      console.log("Error usuario en gruardar favorito");
  }  
}

export async function EliminarPictogramaFavorito(idPictograma: number) {
  let usuario = await getUsuarioLogueado();
  if (usuario != null && usuario.id != null && usuario != undefined){
    return await axios.delete(apiPictogramas + '/pictogramas/favoritos/' + usuario.id + '/' + idPictograma).then((resp) => {
      return resp.data
    });
  } else {
    console.log("Error usuario en eliminar favorito");
  }  
}

export async function VerificarConexion(){
  let response = await axios.get(apiPictogramas + '/categorias/total')
  if (response.status === 200)
    return
  else
    throw "No hay conexion"
}