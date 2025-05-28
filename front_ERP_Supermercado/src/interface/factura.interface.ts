export interface Factura {
  idFactura: number,
  fecha: string,
  fechaVencimiento: string,
  total: number,
  idCarrito: number,
  idCaja: number,
  idMetodoPago: number,
  idCliente: number
}

export interface FacturaE {
  fecha: string,
  fechaVencimiento: string,
  total: number,
  idCarrito: number,
  idMetodoPago: number,
  idCliente: number
}
