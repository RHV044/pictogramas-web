import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerCategorias,
  ObtenerImagenAsBlob,
  ObtenerInformacionPictogramas,
  ObtenerTotalCategorias,
  ObtenerTotalPictogramas,
  ObtenerYGuardarCategorias,
} from '../pictogramas/services/pictogramas-services';
import { IndexedDbService } from './indexeddb-service';
import axios from "axios";
import { IPictogramaImagen } from '../pictogramas/models/pictogramaImagen';
import { getUsuarioLogueado, usuarioLogueado } from './usuarios-services';
import { IPizarra } from '../pizarras/models/pizarra';
import { ActualizarPizarra, EliminarPizarra, ObtenerPizarras } from '../pizarras/services/pizarras-services';
import { GuardarPizarra } from '../pizarras/services/pizarras-services';

const apiPictogramas = process.env.URL_PICTOGRAMAS ?? "http://localhost:5000";

type MyState = {
  categorias: ICategoria[];
};

export class UpdateService {
  state: MyState = {
    categorias: [],
  };

  constructor() {
    console.log('Inicializando UPDATE SERVICE');
    this.initialize();
    //this.actualizarPizarras()
  }

  async initialize() {
    let db = await IndexedDbService.create();

    let totalCategoriasLocales = await db.countValues('categorias');
    let totalCategorias = await ObtenerTotalCategorias();
    console.log(
      `Total categorias: ${totalCategorias} vs total categorias locales: ${totalCategoriasLocales}`
    );
    if (totalCategoriasLocales !== totalCategorias){
      await ObtenerYGuardarCategorias(
        async (cats: ICategoria[]) => {
          cats.forEach(cat => {
            // TODO: Revisar seteo de categoria final o no
            if(cat.categoriaPadre > 0 && !cats.some(c => c.categoriaPadre === cat.id))
              cat.esCategoriaFinal = true
            else
              cat.esCategoriaFinal = false
          });
          await db.putBulkValue('categorias', cats)
        }
      );
    }

    let usuario = await getUsuarioLogueado();
    let totalPictogramasLocales = 1;
    if(usuario != null && usuario !== undefined && usuario.id != null)
      totalPictogramasLocales = await db.countPictogramasPorUsuario('pictograms', usuario.id);
    else
      totalPictogramasLocales = await db.countPictogramasPorUsuario('pictograms', null);
    console.log('Pictogramas locales totales: ', totalPictogramasLocales)
    let totalPictogramas = await ObtenerTotalPictogramas();
    console.log(
      `Total pictogramas: ${totalPictogramas} vs total pictogramas locales: ${totalPictogramasLocales}`
    );
    // TODO: traer pictogramas en general independientemente de la categoria ya que algunos no tienen categoria
    if (totalPictogramasLocales !== totalPictogramas) {
      let informacion = await ObtenerInformacionPictogramas();
      db.putBulkValue('pictograms', informacion);
      
      db.getAllValues('pictograms').then(async (pictogramas : IPictogram[]) => {     

        console.log('se procede a obtener las imagenes de todos los pictogramas');
        console.log('se procede a obtener las imagenes de todos los pictogramas');
        console.log('se procede a obtener las imagenes de todos los pictogramas');
        if(usuario != null && usuario !== undefined && usuario.id != null)
          pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idUsuario === usuario?.id || p.idArasaac !== null))
        else
          pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idArasaac !== null))
        const maxParallelRequests = 500;
        let count = 0;
        let start = 0;
        let end = 1;
        console.log('se levantaron los pictogramas del index db');
        while (count < pictogramas.length) {
          end =
            pictogramas.length - count <= maxParallelRequests
              ? start + (pictogramas.length - count)
              : start + maxParallelRequests;
  
          let aGroupOfInfoPictograms = pictogramas.slice(start, end);
  
          count += end - start;
          start = end;
  
          console.log('Se lanza la primera promesa');
          let groupRequestPromises: Promise<any>[] = aGroupOfInfoPictograms.map(
            // eslint-disable-next-line no-loop-func
            async (pictoInfo: IPictogram) => {
              // Get the pictogram's image
              return axios.get(`${apiPictogramas}/pictogramas/${pictoInfo.id}/obtener/base64`)
              .then(async (response) => {    
                let pictogramaImagen = {id: pictoInfo.id, imagen:response.data} as IPictogramaImagen
                // pictoInfo.imagen = response.data
                pictoInfo.imagen = ''
                await db.putOrPatchValue("pictograms", pictoInfo);
                // console.log('se obtuvo la imagen: ', pictoInfo.imagen)
                await db.putOrPatchValue("imagenes", pictogramaImagen);
              })
            }
          );
  
          await Promise.all(groupRequestPromises);
        }
      });
    }
  }

  async actualizarPizarras(){

    while(true)
    {      
      var millisecondsToWait = 5000000;
      setTimeout(function() {
          // Whatever you want to do after the wait
        try{
          let usuarioId = usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;
          ObtenerPizarras(usuarioId).then((pizarrasApi : IPizarra[]) => {        
            IndexedDbService.create().then((db) => {
              db.getAllValues("pizarras").then((pizarras : IPizarra[]) =>{
      
                // Carga de pizarras de la api que no esten en el indexDb
                pizarrasApi.map(pizarra => {
                  if(!pizarras.some(p => p.id === pizarra.id && !p.pendienteCreacion)){
                    db.putOrPatchValue("pizarras",pizarra)
                  }
                })

                pizarras.map(pizarra => {
                  // Creacion de pizarra en la api
                  if (pizarra.pendienteCreacion){
                    GuardarPizarra(pizarra)
                    pizarra.pendienteCreacion = false
                    db.putOrPatchValue("pizarras",pizarra)
                  }
                  // Actualizacion de pizarra en la api
                  if(pizarra.pendienteActualizacion)
                  {
                    ActualizarPizarra(pizarra)
                    pizarra.pendienteActualizacion = false
                    db.putOrPatchValue("pizarras",pizarra)
                  }
                  // Eliminacion de pizarra en la api
                  if(pizarra.pendienteEliminacion){
                    EliminarPizarra(pizarra).then(() => {
                      db.deleteValue("pizarras",pizarra.id)
                    })
                  }
                })
              })
            });
          })   
        }
        catch(ex){
          
        }   
      }, millisecondsToWait);
    }
  }
}

