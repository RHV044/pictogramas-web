import { IPictogram } from "../pictogramas/models/pictogram"

export type Position = {
  fila: number,
  columna: number
}

export type Grafico = {
  texto: string, 
  posicion: Position,
  esPictograma: boolean,
  imagen: string,
  identificacion: string, 
  idPictograma: number
}

export class Movimientos {
  private graficos: Grafico[] = []
  private ultimoElementoUtilizado: Grafico = {
    esPictograma: false, 
    imagen: '', 
    texto: '', 
    posicion: {columna:-1, fila:-1}, 
    identificacion:Date.now().toString(),
    idPictograma: 0
  }

  public moveElement(toFila: number, toColumna: number): void {
    this.ultimoElementoUtilizado.posicion.columna = toColumna
    this.ultimoElementoUtilizado.posicion.fila = toFila
  }

  public hayAlgo(fila: number, columna: number): boolean {
    return this.graficos.some(g => g.posicion.columna === columna && g.posicion.fila === fila)
  }

  public moveGrafico(valor: string){
    this.graficos.map(g => {
      if (g.identificacion === valor)
      {
        g.identificacion = Date.now().toString()
        g.posicion.columna = this.ultimoElementoUtilizado.posicion.columna
        g.posicion.fila = this.ultimoElementoUtilizado.posicion.fila
      }
    })
  }

  public agregarGrafico(grafico : Grafico){
    this.graficos.push(grafico)
  }

  public getGraficos(){
    return this.graficos
  }

  public eliminarGrafico(valor: string){
    this.graficos = [...this.graficos.filter(g => g.identificacion !== valor)]
  }

  public agregarPictograma(pic: IPictogram){
    this.graficos.push({
      esPictograma: true,
      imagen: pic.imagen, 
      texto: pic.keywords[0].keyword, 
      posicion: {columna: -1, fila: -1}, 
      identificacion:Date.now().toString(),
      idPictograma: pic.id
    })
  }
}