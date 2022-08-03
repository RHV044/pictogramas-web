export interface DragItem {
  type: string
  dropped: (item: any) => void
  name: string
}