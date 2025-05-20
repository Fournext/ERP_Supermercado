export interface Carrito {
  idCarrito: number,
  total: number,
  estado: string,
  fecha: string,
  idCliente: number
}

export interface DetalleCarrito {
  idDetalleCarrito?: number,
  cantidad: number,
  precio: number,
  subtotal: number,
  idProducto: number,
  idCarrito?: number
  url: string,
  descripcion: string
}
