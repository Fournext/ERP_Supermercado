export interface BoletaCompra {
  idBoletaCompra: number,
  costoTotal: number,
  fecha: string,
  idProveedor: number,
  idMetodoPago: number,
  estado: string

}

export interface DetalleCompra {
  idDetalle: number,
  idBoleta: number,
  cantidad: number,
  costoUnitario: number,
  idProducto: number,
  codigoProducto: string,
  descripcion: string
}
