export type Position = {
  fila: number,
  columna: number
}
export type PositionObserver = ((position: Position) => void) | null
export type Grafico = {
  texto: string, 
  posicion: Position,
  esPictograma: boolean,
  imagen: string
}

export class Movimientos {
  private observers: PositionObserver[] = []
  private graficos: Grafico[] = []
  private ultimoElementoUtilizado: Grafico = {esPictograma: false, imagen: '', texto: '', posicion: {columna:-1, fila:-1}}

  public observe(o: PositionObserver): () => void {
    this.observers.push(o)
    this.emitChange()

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o)
    }
  }
  public moveElement(toFila: number, toColumna: number): void {
    this.ultimoElementoUtilizado.posicion.columna = toColumna
    this.ultimoElementoUtilizado.posicion.fila = toFila
  }

  public hayAlgo(fila: number, columna: number): boolean {
    return this.graficos.some(g => g.posicion.columna === columna && g.posicion.fila === fila)
  }

  private emitChange() {

    //this.observers.forEach((o) => o && o(pos))
  }

  public addGrafico(valor: string){
    this.ultimoElementoUtilizado.texto = valor
    if(this.ultimoElementoUtilizado)
    {
      this.graficos.push(this.ultimoElementoUtilizado)
    }
    console.log('GRAFICOS: ', this.graficos)
  }

  public getGraficos(){
    return this.graficos
  }

  // public removeGrafico(valor: string){
  //   this.graficos.fil(grafico)
  // }
}