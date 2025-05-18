export interface BoletaEntrada {
  idBoleta: number,
  fecha: string,
  descripcion: string,
  estado: string,
  idBoletaCompra: number,
  idPersonal: number
}
export interface DetalleBoletaEntradaObtenido {
  idBoleta: number,
  cantidad: number,
  idBoletaEntrada: number,
  idProducto: number,
  costoUnitario: number,
  idLote: number,
  cantidadComprada: number,
}
export interface DetalleBoletaEntradaEnviar {
  cantidad: number,
  idBoletaEntrada: number,
  idProducto: number,
  cantidadComprada: number,
  costoUnitario: number,
  idLote: number,
}


