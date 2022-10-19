export interface IFavoritoPorUsuario {
    id: string,
    idUsuario: number,
    idCategoria: number,
    pendienteEliminar: boolean,
    pendienteAgregar: boolean
}