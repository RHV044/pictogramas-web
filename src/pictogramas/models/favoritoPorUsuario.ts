export interface IFavoritoPorUsuario {
    id: string,
    idUsuario: number,
    idPictograma: number,
    pendienteEliminar: boolean,
    pendienteAgregar: boolean
}

export interface IFavoritoPorUsuarioApi {
    id: string,
    usuarioId: number,
    pictogramaId: number,
    pendienteEliminar: boolean,
    pendienteAgregar: boolean
}