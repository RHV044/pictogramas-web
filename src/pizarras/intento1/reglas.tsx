export type Position = [number, number]
export type PositionObserver = ((position: Position) => void) | null
export type Grafico = [string, Position]

export class Reglas {
  private observers: PositionObserver[] = []
  private graficos: Grafico[] = []

  public observe(o: PositionObserver): () => void {
    this.observers.push(o)
    this.emitChange()

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o)
    }
  }
  public move(toX: number, toY: number): void {

  }

  private emitChange() {

    //this.observers.forEach((o) => o && o(pos))
  }
}