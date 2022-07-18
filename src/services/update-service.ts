import Pictogramas from '../pictogramas/components/pictogramas';
import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerCategorias,
  ObtenerImagen,
  ObtenerImagenAsBlob,
  ObtenerInformacionPictogramas,
  ObtenerPictogramasPorCategoria,
  ObtenerTotalCategorias,
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
    console.log(`Total pictogramas: ${totalPictogramas} vs total pictogramas locales: ${totalPictogramasLocales}`)
    // TODO: traer pictogramas en general independientemente de la categoria ya que algunos no tienen categoria
    if (totalPictogramasLocales !== totalPictogramas) {
      let informacion = await ObtenerInformacionPictogramas();
      db.putBulkValue('pictograms', informacion)
    }

    db.getAllValues('pictograms').then((pictogramas) => {
      console.log('se levantaron los pictogramas del index db');
      pictogramas.map((p) => {
        ObtenerImagenAsBlob(p);
      });
    });
  }
}
