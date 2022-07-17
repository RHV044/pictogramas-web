import { IKeyword } from "./keyword";

export interface IPictogram {
  id: number;
  blob: Blob;
  name: string;
  description: string;
  tags: string[];
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
  categorias: number[];
  imagen: any
}
