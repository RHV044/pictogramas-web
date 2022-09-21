export interface IPizarra { 
  id: number, 
  nombre: string,
  filas: number,
  columnas: number,
  usuarioId: number,
  celdas: ICeldaPizarra[],
  pendienteCreacion: boolean,
  pendienteActualizacion: boolean,
  pendienteEliminacion: boolean,
  ultimaActualizacion: Date
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