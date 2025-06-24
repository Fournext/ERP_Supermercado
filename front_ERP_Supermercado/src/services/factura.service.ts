import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Factura, FacturaE } from '../interface/factura.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'factura';

  public listaFactura = signal<Factura[]>([]);

  registrarFactura(factura: FacturaE) {
    this.http.post<Factura>(`${this.apiUrl}${this.complementoUrl}/registrar`, factura).subscribe(
      (response: Factura) => {
        this.obtenerFacturas(response.idCliente);
      }
    )
  }

  obtenerFacturas(idCliente: number) {
    this.http.get<Factura[]>(`${this.apiUrl}${this.complementoUrl}/listar`, {
      params: {
        id: idCliente
      }
    }).subscribe(
      (response: Factura[]) => {
        this.listaFactura.set(response);
      }
    );
  }

  //Vamos a obtener los datos para las graficas
  obtenerDatosVentaDiariaProductos(inicio: string, fin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.complementoUrl}/listar-ventas-productos-dia`, {
      params: {
        inicio: inicio,
        fin: fin
      }
    });
  }

  obtenerMontoVentaDiario(inicio: string, fin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.complementoUrl}/listar-monto-por-dia`, {
      params: {
        inicio: inicio,
        fin: fin
      }
    });
  }

  constructor() { }

}
