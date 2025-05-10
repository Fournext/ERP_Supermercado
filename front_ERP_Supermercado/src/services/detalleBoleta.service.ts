import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleBoletaService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'detalle_boleta';

  registrarDetalleBoletaCompra(cantidad: number, costoUnitario: number, idBoletaCompra: number, idProducto: number) {
    const body = {
      cantidad: cantidad,
      costoUnitario: costoUnitario,
      idBoletaCompra: idBoletaCompra,
      idProducto: idProducto
    }
    console.log(body);
    this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/registrar`, body).subscribe((response)=>{
      console.log('entra');
    });
  }

  obtenerDetallesBoletaCompra(id: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}${this.complementoUrl}/obtener_detalles`, {
      params: {
        id: id
      }
    })
  }
  constructor() { }

}
