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
  idPictograma: number,
  identificadorPictograma: string
}

export class Movimientos {
  private graficos: Grafico[] = []
  private observers: any[] = []
  private ultimoElementoUtilizado: Grafico = {
    esPictograma: false, 
    imagen: '', 
    texto: '', 
    posicion: {columna:-1, fila:-1}, 
    identificacion:Date.now().toString(),
    idPictograma: 0,
    identificadorPictograma: ''
  }

  public addObserver(observer: any){
    this.observers.push(observer)
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
    for (let i = 0; i < this.observers.length; i++) {
      // get the current function getting looped
      const func = this.observers[i];
    
      // call the function
      func();
    }
  }

  public getGraficos(){
    return this.graficos
  }

  public eliminarGrafico(valor: string){
    this.graficos = [...this.graficos.filter(g => g.identificacion !== valor)]
  }

  public eliminarGraficos(){
    this.graficos = []
  }

  public agregarPictograma(pic: IPictogram){
    this.graficos.push({
      esPictograma: true,
      imagen: pic.imagen, 
      texto: pic.keywords[0].keyword, 
      posicion: {columna: -1, fila: -1}, 
      identificacion:Date.now().toString(),
      idPictograma: pic.id,
      identificadorPictograma: pic.identificador
    })
  }
}