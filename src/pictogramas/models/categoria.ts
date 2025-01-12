import { IPictogram } from "./pictogram";

export interface ICategoria { 
  id: number,
  nombre: string,
  pictogramas: IPictogram[]
  nivel: number,
  categoriaPadre: number,
  esCategoriaFinal: boolean,
  imagen: string
}