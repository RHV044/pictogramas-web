import axios from "axios";
import { stringify } from "querystring";
import { IUsuario } from "../../login/model/usuario";
import { IndexedDbService } from "../../services/indexeddb-service";
import { getUsuarioLogueado, usuarioLogueado } from "../../services/usuarios-services";
import { ICategoria } from "../models/categoria";
import { IPictogram } from "../models/pictogram";

const apiPictogramas = process.env.REACT_APP_URL_PICTOGRAMAS ?? "http://localhost:5000";

export function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

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

export async function ObtenerCategoriasPadre(setCategoriasPadre: any){
  let db = await IndexedDbService.create();
  let categorias = await db.getAllValues('categorias');
  if(categorias){
    let categoriasPadre = categorias.filter(c => c.categoriaPadre === null);
    return await setCategoriasPadre(categoriasPadre);
  } else {
        console.log('no se pueden obtener categorias padre');
  }

  // if (categoriasPadre){
  // }
  // else{
  //   return await axios.get(apiPictogramas + '/categorias')
  //   .then(response => {
  //     setCategorias(response.data)
  //   })
  // }
}

export async function ObtenerCategoriasHijas(setCategorias: any, idCategoriaPadre: number){

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
  let pictogramas = await db.getAllValues('pictograms');

  let usuario = await getUsuarioLogueado();
  
  if(categoria === -1)
  {
    let pictogramasPropios = await db.getAllValues('pictogramasPropios');
    if (pictogramasPropios !== null && pictogramasPropios !== undefined && pictogramasPropios.length > 0)
    {
      console.log("TODOS LOS PICTOGRAMAS PROPIOS: ", pictogramasPropios)
      const pp = pictogramas.concat(pictogramasPropios)
      let propios = pp.filter((p: IPictogram) => p.idUsuario === usuario?.id)
      console.log("PICTOGRAMAS PROPIOS FILTRADOS: ", propios)
      return await setPictogramas(propios)
    }
  }

  if (categoria === -2)
  {
    let pictogramasFavoritos;
    if(usuario !== null && usuario !== undefined) 
      pictogramasFavoritos = await db.searchFavoritoByUser(usuario?.id); //TODO le pregunto a Gonza por las dudas
        
      if (pictogramasFavoritos !== null && pictogramasFavoritos !== undefined && pictogramasFavoritos.length > 0)
        {
          const pf = pictogramas.filter(p => pictogramasFavoritos.some(pic => pic.idPictograma === p.id))
          for(var i=0; i<pf.length; ++i){
            let imagen = (await db.getValue('imagenes', pf[i].id))
            pf[i].imagen = imagen !== undefined && imagen !== null ? imagen.imagen : ""
          }
          return await setPictogramas(pf)
        }
  }

  if(categoria !== -2 && categoria !== -1)
  {
    if(usuario != null && usuario !== undefined && usuario.id != null)
      pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idUsuario === usuario?.id || p.idArasaac !== null))
    else
      pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idArasaac !== null))
    if (pictogramas){
      let pictogramasFiltrados = pictogramas.filter((p: IPictogram) => p.categorias && p.categorias.some((c: ICategoria) => c.id === categoria))

      //TODO: Si el pictograma es propio, la imagen esta en otro indexedDb
      for(var i=0; i<pictogramasFiltrados.length; ++i){
        let imagen = (await db.getValue('imagenes', pictogramasFiltrados[i].id))
        pictogramasFiltrados[i].imagen = imagen !== undefined && imagen !== null ? imagen.imagen : ""
      }

      return await setPictogramas(pictogramasFiltrados)
    }
  }
  else {
  return await axios.get(apiPictogramas + '/pictogramas/categorias/id/'+ categoria)
    .then(response => {
      console.log('pictogramas por categoria: ', response.data)
      setPictogramas(response.data)
    })
  }
}

export async function ObtenerPictogramasConImagenes(ids : number[]){
  let db = await IndexedDbService.create();
  let pictogramas = await db.getAllValues('pictograms');
  let pictogramasFiltrados = pictogramas.filter((p: IPictogram) => ids.includes(p.id))

  for(var i=0; i<pictogramasFiltrados.length; ++i)
    pictogramasFiltrados[i].imagen = (await db.getValue('imagenes', pictogramasFiltrados[i].id)).imagen

  return pictogramasFiltrados
}

export async function ObtenerPictogramaConImagenes(id : number){
  let db = await IndexedDbService.create();
  let pictograma = await db.getValue('pictograms', id);

  pictograma.imagen = (await db.getValue('imagenes', pictograma.id)).imagen

  return pictograma
}

export async function ObtenerCategoriasPorIds(ids : number[]){
  let db = await IndexedDbService.create();
  let categorias = await db.getAllValues('categorias');
  let categoriasFiltradas = categorias.filter((c: ICategoria) => ids.includes(c.id))
  return categoriasFiltradas
}

export async function ObtenerImagen(
  pictograma: number
){
  return await (await axios.get(apiPictogramas + '/pictogramas/' + pictograma +'/obtener')).data
}

export async function ObtenerImagenDePictogramaLocal(
  pictograma: number
){
  let db = await IndexedDbService.create();
  return await db.getValue('imagenes', pictograma);
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

export async function ObtenerTotalImagenesPictogramas() {
  let url: string;
  url = '/pictogramas/imagenes/total';
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

export async function GuardarPictogramaFavorito(idPictograma: number, idUsuario: number) {
    return await axios.post(apiPictogramas + '/pictogramas/favoritos/' + idUsuario + '/' + idPictograma).then((resp) => {
      return resp.data
    });
}

export async function EliminarPictogramaPropio(identificador: string) {
  let usuario = await getUsuarioLogueado();
  if (usuario != null && usuario.id != null && usuario != undefined){
    return await axios.delete(apiPictogramas + '/pictogramas/propios/' + usuario.id + '/' + identificador).then((resp) => {
      return resp.data
    });
  } else {
    console.log("Error en eliminar pictograma propio");
  }  
}

export async function EliminarPictogramaFavorito(idPictograma: number, idUsuario: number) {
    return await axios.delete(apiPictogramas + '/pictogramas/favoritos/' + idUsuario + '/' + idPictograma).then((resp) => {
      return resp.data
    });
}

export async function VerificarConexion(){
  let response = await axios.get(apiPictogramas + '/categorias/total')
  if (response.status === 200)
    return
  else
    throw "No hay conexion"
}

export function PictogramaNoSeDebeTraducir(pictograma : IPictogram){
  let pictos = [18,19,1128,2234,3672,5446,5449,5451,5455,7979]
  return !pictos.includes(pictograma.id)
}