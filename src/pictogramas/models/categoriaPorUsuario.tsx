export interface ICategoriaPorUsuario {
    id: string,
    idUsuario: number,
    idCategoria: number,
    pendienteEliminar: boolean,
    pendienteAgregar: boolean
}