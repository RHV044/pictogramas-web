export type Position = {
  fila: number,
  columna: number
}
export type PositionObserver = ((position: Position) => void) | null
export type Grafico = {
  valor: string, 
  posicion: Position
}

export class Movimientos {
  private observers: PositionObserver[] = []
  private graficos: Grafico[] = []

  public observe(o: PositionObserver): () => void {
    this.observers.push(o)
    this.emitChange()

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o)
    }
  }
  public moveElement(toFila: number, toColumna: number): void {

  }

  private emitChange() {

    //this.observers.forEach((o) => o && o(pos))
  }

  public addGrafico(valor: string){
    let grafico = {valor: valor, posicion: {columna:0, fila:0}} as Grafico
    this.graficos.push(grafico)
  }

  // public removeGrafico(valor: string){
  //   this.graficos.fil(grafico)
  // }
}