import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MetodoPago } from '../interface/metodoPago.interface';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'metodo_pago';
  //lista de metodos de pago
  listaMetodoPago = signal<MetodoPago[]>([]);

  public getMetodoPagos() {
    this.http.get<MetodoPago[]>(`${this.apiUrl}${this.complementoUrl}/listar`).subscribe(
      (response) => {
        const listaMetodoPago: MetodoPago[] = response.map((metodoPago) => {
          const metodoPagoActual: MetodoPago = {
            metodoPagoId: metodoPago.metodoPagoId,
            nombre: metodoPago.nombre
          }
          return metodoPagoActual;
        });
        console.log(listaMetodoPago);
        this.listaMetodoPago.set(listaMetodoPago);
      }
    );
  }

  constructor() {
  }

}
