export interface IPizarra { 
  id: number, //TODO: Como primero voy a guardar en el storage, no tengo id de la api
  nombre: string,
  filas: number,
  columnas: number,
  usuarioId: number,
  celdas: ICeldaPizarra[],
  pendienteCreacion: boolean,
  pendienteActualizacion: boolean,
  pendienteEliminacion: boolean
}

export interface ICeldaPizarra{
  id: number,
  pizarraId: number,
  fila: number,
  columna: number,
  contenido: string,
  tipoContenido: string,
  color: string,
  identificacion: string
}