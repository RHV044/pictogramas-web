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
import { getUsuarioLogueado } from './usuarios-services';

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
        async (cats: ICategoria[]) => (await db.putBulkValue('categorias', cats))
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
}
