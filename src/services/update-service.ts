import { ICategoria } from "../pictogramas/models/categoria"
import { IPictogram } from "../pictogramas/models/pictogram"
import { ObtenerCategorias, ObtenerPictogramasPorCategoria } from "../pictogramas/services/pictogramas-services"
import { IndexedDbService } from "./indexeddb-service"

type MyState = {
  categorias: ICategoria[]
}

export class UpdateService {

  state: MyState = {
    categorias: []
  }

  constructor(){
    console.log('Inicializando UPDATE SERVICE')
    this.initialize()
  }

  async initialize() {
    let db = await IndexedDbService.create()
    await ObtenerCategorias((cats: ICategoria[]) => this.state.categorias = cats);
    console.log('Update Service - Se obtuvieron las categorias: ',    
     this.state.categorias)
    this.state.categorias.map(async (c) => {
      await ObtenerPictogramasPorCategoria(
        (pics: IPictogram[]) => c.pictogramas = pics,
        c.id)
      console.log('Update Service - Se obtuvieron pictogramas de categoria: ',
        c.pictogramas)
    })
    db.putBulkValue('categorias', this.state.categorias)
  }
}