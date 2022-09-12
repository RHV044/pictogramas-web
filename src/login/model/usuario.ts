import internal from "stream";

export interface IUsuario {
  id?: number;
  identificador: string;
  nombreUsuario: string;
  password: string;  
  logueado?: boolean;
  hair: boolean;
  sex: boolean;
  aac: boolean;
  aacColor: boolean;
  skin: boolean;
  violence: boolean;
  schematic: boolean;
  nivel: number;
  pendienteCreacion: boolean;
  pendienteActualizacion: boolean;
  // EL USUARIO NO SE ELIMINA DE LA DB
}