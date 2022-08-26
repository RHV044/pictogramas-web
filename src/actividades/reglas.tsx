import { ICategoria } from "../pictogramas/models/categoria"
import { IPictogram } from "../pictogramas/models/pictogram"

export class Reglas{

  public verigicarMovimiento(pictograma: IPictogram, toCategoria: ICategoria): boolean {
    return pictograma.categorias.some(c => c.id === toCategoria.id)
  }
}