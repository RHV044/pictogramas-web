import { IPictogram } from "../../pictogramas/models/pictogram";
import { IEstadistica } from "./estadistica";

export interface IPictogramaEstadistica{
  id: number,
  cantidad: number,
  estadisticas: IEstadistica[],
  pictograma: IPictogram
}