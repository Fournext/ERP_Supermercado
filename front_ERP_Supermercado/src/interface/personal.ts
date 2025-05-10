export interface personal {
    id_personal?: number;
    nombre: string;
    apellido: string;
    carnet: string;
    fecha_creacion: Date;
    idRol: number;
    idTurno: number;
    idUsuario: number;
}

export interface crearPersonal {
    id_personal?: number;
    nombre: string;
    apellido: string;
    carnet: string;
    fecha_creacion: Date;
    idRol: number;
    idTurno: number;
    username: string;
    email: string;
    password: string;
    idUsuario?: number;
}