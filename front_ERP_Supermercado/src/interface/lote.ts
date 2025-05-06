export interface Lote{  
    id_lote?: number,
    stock: number,
    stock_minimo: number,
    cod_repisa: string,
    nombre_estado: string,
    descripcion_producto: string,
    cod_almacen: string,
    costo_unitario: number,
    fecha_caducidad: string
}