import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerImagenAsBlob,
  ObtenerInformacionPictogramas,
  ObtenerTotalPictogramas,
} from '../pictogramas/services/pictogramas-services';
import { IndexedDbService } from './indexeddb-service';

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
    let totalPictogramasLocales = await db.countValues('pictograms');
    let totalPictogramas = await ObtenerTotalPictogramas();
    console.log(
      `Total pictogramas: ${totalPictogramas} vs total pictogramas locales: ${totalPictogramasLocales}`
    );
    // TODO: traer pictogramas en general independientemente de la categoria ya que algunos no tienen categoria
    if (totalPictogramasLocales !== totalPictogramas) {
      let informacion = await ObtenerInformacionPictogramas();
      db.putBulkValue('pictograms', informacion);
    }

    db.getAllValues('pictograms').then(async (pictogramas) => {
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

        let groupRequestPromises: Promise<any>[] = aGroupOfInfoPictograms.map(
          // eslint-disable-next-line no-loop-func
          async (pictoInfo: IPictogram) => {
            // Get the pictogram's image
            await ObtenerImagenAsBlob(pictoInfo);
          }
        );
        await Promise.all(groupRequestPromises);
      }
      // pictogramas.map((p) => {
      //   ObtenerImagenAsBlob(p);
      // });
    });
  }
}