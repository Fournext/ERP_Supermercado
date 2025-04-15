export interface personal {
    id_personal?: number;
    nombre: string;
    apellido: string;
    carnet: string;
    fecha_creacion: Date;
    id_rol?: number;
    id_turno?: number;
    id_usuario?: { id_usuario: number };

}