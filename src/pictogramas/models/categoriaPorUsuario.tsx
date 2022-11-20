export interface ICategoriaPorUsuario {
    id: string,
    idUsuario: number,
    idCategoria: number,
    pendienteEliminar: boolean,
    pendienteAgregar: boolean
}

export interface ICategoriaPorUsuarioApi {
    id: string,
    usuarioId: number,
    categoriaId: number,
    pendienteEliminar: boolean,
    pendienteAgregar: boolean
}