export interface VentaDiarioProducto {
  fecha: string,
  idProducto: number,
  descripcion: string,
  cantidadTotal: number
}

export interface MontoVentaDiaria {
  fecha: string,
  total: number
}
