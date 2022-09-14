import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerCategorias,
  ObtenerImagenAsBlob,
  ObtenerInformacionPictogramas,
  ObtenerTotalCategorias,
  ObtenerTotalPictogramas,
  ObtenerYGuardarCategorias,
  VerificarConexion,
} from '../pictogramas/services/pictogramas-services';
import { IndexedDbService } from './indexeddb-service';
import axios from "axios";
import { IPictogramaImagen } from '../pictogramas/models/pictogramaImagen';
import { ActualizarUsuario, CrearUsuario, getUsuarioLogueado, ObtenerUsuarioInfo, ObtenerUsuarios, usuarioLogueado } from './usuarios-services';
import { IPizarra } from '../pizarras/models/pizarra';
import { ActualizarPizarra, EliminarPizarra, ObtenerPizarras } from '../pizarras/services/pizarras-services';
import { GuardarPizarra } from '../pizarras/services/pizarras-services';
import { IUsuario } from '../login/model/usuario';

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
    this.addEventsListener()
    this.sincronizar()
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
            if(!cats.some(c => c.categoriaPadre === cat.id))
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
    if (totalPictogramasLocales !== totalPictogramas) {
      let informacion = await ObtenerInformacionPictogramas(); // obtiene pictos de arasaac y de usuario
      let informacionPropios = informacion.filter(p => p.IdUsuario === usuario?.id)
      let informacionArasaac = informacion.filter(p => p.idArasaac > 0)
      
      db.putBulkValue('pictograms', informacionArasaac);      
      db.putBulkValue('pictogramasPropios', informacionPropios);
      
      // Obtencion imagenes de pictogramas arasaac
      db.getAllValues('pictograms').then(async (pictogramas : IPictogram[]) => {     
        if(usuario != null && usuario !== undefined && usuario.id != null)
        pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idUsuario === usuario?.id || p.idArasaac !== null))
      else
        pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idArasaac !== null))
        const maxParallelRequests = 500;
        let count = 0;
        let start = 0;
        let end = 1;
        while (count < pictogramas.length) {
          end =
            pictogramas.length - count <= maxParallelRequests
              ? start + (pictogramas.length - count)
              : start + maxParallelRequests;
  
          let aGroupOfInfoPictograms = pictogramas.slice(start, end);
  
          count += end - start;
          start = end;
  
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

      // Obtencion imagenes de pictogramas pictogramas propios
      db.getAllValues('pictogramasPropios').then(async (pictogramas : IPictogram[]) => {     
        if(usuario != null && usuario !== undefined && usuario.id != null)
        pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idUsuario === usuario?.id || p.idArasaac !== null))
      else
        pictogramas = pictogramas.filter(p => (p.idUsuario === null || p.idArasaac !== null))        
        const maxParallelRequests = 500;
        let count = 0;
        let start = 0;
        let end = 1;
        while (count < pictogramas.length) {
          end =
            pictogramas.length - count <= maxParallelRequests
              ? start + (pictogramas.length - count)
              : start + maxParallelRequests;
  
          let aGroupOfInfoPictograms = pictogramas.slice(start, end);  
          count += end - start;
          start = end;

          let groupRequestPromises: Promise<any>[] = aGroupOfInfoPictograms.map(
            // eslint-disable-next-line no-loop-func
            async (pictoInfo: IPictogram) => {
              // Get the pictogram's image
              return axios.get(`${apiPictogramas}/pictogramas/${pictoInfo.id}/obtener/base64`)
              .then(async (response) => {    
                let pictogramaImagen = {id: pictoInfo.id, imagen:response.data} as IPictogramaImagen
                // pictoInfo.imagen = response.data
                pictoInfo.imagen = ''
                await db.putOrPatchValue("pictogramasPropios", pictoInfo);
                // console.log('se obtuvo la imagen: ', pictoInfo.imagen)
                await db.putOrPatchValue("imagenesPropias", pictogramaImagen);
              })
            }
          );
  
          await Promise.all(groupRequestPromises);
        }
      });
    }
  }

  async addEventsListener(){
    window.addEventListener('online', () => {
      console.log("Hay conexion")
      this.sincronizar()
    });
    window.addEventListener('sincronizar', () => {
      console.log("EVENTO SINCRONIZAR")
      this.sincronizar()
    });
    window.addEventListener('offline', () => {
      console.log("Se perdio la conexion")
    });
  }

  async sincronizar(){
    if(window.navigator.onLine)
    {
      this.actualizarPizarras();
      this.actualizarUsuarios();
      this.actualizarPictogramas();
    }
  }

  async actualizarUsuarios(){
    try{
      //Obtener usuarios del indexDB
      IndexedDbService.create().then((db) => {
        db.getAllValues("usuarios").then(async(usuarios : IUsuario[]) => {
          usuarios.map(async (usuario) => {
            //Creacion de usuario pendiente
            if (usuario.pendienteCreacion){
              await CrearUsuario(usuario)
              usuario.pendienteCreacion = false
              db.putOrPatchValueWithoutId("usuarios",usuario)
            }
            //Chequeo de usuario actualizado en la api
            else{
              ObtenerUsuarioInfo(usuario.identificador).then((usuarioApi: IUsuario) => {
                if (usuarioApi.ultimaActualizacion > usuario.ultimaActualizacion)
                {
                  usuario.pendienteActualizacion = false
                  db.putOrPatchValueWithoutId("usuarios",usuarioApi)
                }
              })
            }
            // Actualizacion de usuario en la api
            if(usuario.pendienteActualizacion)
            {
              await ActualizarUsuario(usuario)
              usuario.pendienteActualizacion = false
              db.putOrPatchValueWithoutId("usuarios",usuario)
            }
          })
        })
      })
    }
    catch(ex){

    }
  }

  async actualizarPictogramas(){
    try{      
      //await VerificarConexion()
      let usuarioId = usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;
      ObtenerInformacionPictogramas().then(pictogramas => {
        let pictogramasFiltrados = pictogramas.filter((p : IPictogram) => p.idUsuario === usuarioId)
        
        IndexedDbService.create().then((db) => {
          db.getAllValues("pictogramas")
            .then(async (pictogramasLocales : IPictogram[]) =>
            {

            })
        })
      })                
    }
    catch(ex){
      console.log(ex)
    }
  }

  async actualizarPizarras(){
    try{      
      let usuarioId = usuarioLogueado?.id !== undefined ? usuarioLogueado?.id : 0;
      ObtenerPizarras(usuarioId).then((pizarrasApi : IPizarra[]) => {        
        IndexedDbService.create().then((db) => {
          db.getAllValues("pizarras").then(async (pizarras : IPizarra[]) =>{
  
            // Carga de pizarras de la api que no esten en el indexDb
            pizarrasApi.map(pizarra => {
              if(!pizarras.some(p => p.id === pizarra.id && !p.pendienteCreacion)){
                db.putOrPatchValue("pizarras",pizarra)
              }
            })

            pizarras.map(async (pizarra) => {
              // Creacion de pizarra en la api
              if (pizarra.pendienteCreacion){
                await GuardarPizarra(pizarra)
                pizarra.pendienteCreacion = false
                db.putOrPatchValue("pizarras",pizarra)
              }
              // Actualizacion de pizarra
              if(pizarra.pendienteActualizacion)
              {
                if (pizarras.some(p => p.id === pizarra.id && p.ultimaActualizacion > pizarra.ultimaActualizacion) )
                {
                  // Debo actualizar la pizarra en el IndexDb
                  let p = pizarras.find(p => p.id === pizarra.id)
                  pizarra =  p ? p : pizarra;
                  db.putOrPatchValue("pizarras",pizarra)
                }
                else
                {
                  // Debo actualizar la pizarra en la api
                  await ActualizarPizarra(pizarra)
                  pizarra.pendienteActualizacion = false
                  db.putOrPatchValue("pizarras",pizarra)
                }
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
      console.log(ex)
    }   
  }
}

