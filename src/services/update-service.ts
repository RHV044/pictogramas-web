import Pictogramas from '../pictogramas/components/pictogramas';
import { ICategoria } from '../pictogramas/models/categoria';
import { IPictogram } from '../pictogramas/models/pictogram';
import {
  ObtenerCategorias,
  ObtenerImagen,
  ObtenerImagenAsBlob,
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
    let totalCategoriasLocales = await db.countValues('categorias');
    let totalPictogramas = await ObtenerTotalPictogramas();
    let totalCategorias = await ObtenerTotalCategorias();
    console.log(`Total pictogramas: ${totalPictogramas} vs total pictogramas locales: ${totalPictogramasLocales}`)
    console.log(`Total categorias: ${totalCategorias} vs total categorias locales: ${totalCategoriasLocales}`)
    // TODO: traer pictogramas en general independientemente de la categoria ya que algunos no tienen categoria
    if (
      totalCategorias !== totalCategoriasLocales &&
      totalPictogramasLocales !== totalPictogramas
    ) {
      await ObtenerCategorias(
        (cats: ICategoria[]) => (this.state.categorias = cats)
      );
      console.log(
        'Update Service - Se obtuvieron las categorias: ',
        this.state.categorias,
        ' - Total: ',
        this.state.categorias.length
      );
      this.state.categorias.map(async (c) => {
        await ObtenerPictogramasPorCategoria(
          (pics: IPictogram[]) => (c.pictogramas = pics),
          c.id
        );
        c.pictogramas.map(async (p) => {
          let pictograma = await db.getValue('´pictograms', p.id);
          if (pictograma !== null) {
            pictograma.categorias.concat(c.id);
            //pictograma.imagen = await ObtenerImagen(pictograma.id)
            db.putOrPatchValue('pictograms', pictograma);
          } else {
            p.categorias = [c.id];
            //p.imagen = await ObtenerImagen(p.id)
            db.putOrPatchValue('pictograms', p);
          }
        });
        console.log(
          'Update Service - Se obtuvieron los pictogramas por categoria: ',
          c.id,
          ' - Total: ',
          c.pictogramas.length
        );
      });
      let categoriasInsertadas = db.putBulkValue(
        'categorias',
        this.state.categorias
      );
    }
    db.getAllValues('pictogram').then((pictogramas) => {
      console.log('se levantaron los pictogramas del index db');
      pictogramas.map((p) => {
        ObtenerImagenAsBlob(p);
      });
    });
  }
}
