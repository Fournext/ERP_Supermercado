import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Factura, FacturaE } from '../interface/factura.interface';

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



  constructor() { }

}
