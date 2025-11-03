export interface ICreateHistorialModel {
    idHistorial: number;
    idSolicitud: number;
    idUsuario: number;
    idEstadoAnterior: number;
    idEstadoNuevo: number;
    comentario: string;
    fechaCreacion: Date;
}
