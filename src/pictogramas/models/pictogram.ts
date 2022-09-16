import { ICategoria } from "./categoria";
import { IKeyword } from "./keyword";
import { ITag } from "./tag";

export interface IPictogram {
  id: number;
  blob: Blob;
  name: string;
  description: string;
  tags: ITag[];
  schematic: boolean;
  sex: boolean;
  violence: boolean;
  aac: boolean;
  aacColor: boolean;
  skin: boolean;
  hair: boolean;
  keywords: IKeyword[];
  idArasaac: number;
  idUsuario: number;
  categorias: ICategoria[];
  imagen: string;
  Identificador: string;
  PendienteCreacion: boolean;
  PendienteEliminacion: boolean;
}
