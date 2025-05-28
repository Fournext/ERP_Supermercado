export interface BoletaRecepcion{  
    idBoleta?:number,
    descripcion: string,
    puntaje?:number,
    idCliente: number, 
    idFactura: number,
    nombreCliente?: string, 
}