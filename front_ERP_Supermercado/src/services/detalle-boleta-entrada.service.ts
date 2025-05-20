import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DetalleBoletaEntradaObtenido } from '../interface/boletaEntrada.interface';

@Injectable({
  providedIn: 'root'
})
export class DetalleBoletaEntradaService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'detalle_boleta_entrada';

  //datos globales(temporales)
  listaDetallesBoletaEntradaActual = signal<DetalleBoletaEntradaObtenido[]>([]);

  registrarDetalleBoleta(cantidad: number, idBoletaEntrada: number, idProducto: number, cantidadComprada: number, costoUnitario: number, idLote: number) {
    const body = {
      cantidad: cantidad,
      idBoletaEntrada: idBoletaEntrada,
      idProducto: idProducto,
      cantidadComprada: cantidadComprada,
      costoUnitario: costoUnitario,
      idLote: idLote
    }
    this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/registrar`, body).subscribe(
      (response) => {
        console.log(response);
      }
    )
  }

  obtenerDetallesByIdBoletaEntrada(id: number) {
    this.http.get<DetalleBoletaEntradaObtenido[]>(`${this.apiUrl}${this.complementoUrl}/obtenerDetallesByIdBoleta`, {
      params: {
        id: id
      }
    }).subscribe((response => {
      const listaDetallesActual = response.map((detalle: DetalleBoletaEntradaObtenido) => detalle);
      this.listaDetallesBoletaEntradaActual.set(listaDetallesActual);
    }));
  }


  constructor() { }

}
