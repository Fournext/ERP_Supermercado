import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ProductoConPrecio } from '../interface/producto.interface';
import { Observable } from 'rxjs';
import { Carrito } from '../interface/carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'carrito';

  //Datos globales
  carritoActual = signal<Carrito>({
    idCarrito: 0,
    total: 0.0,
    estado: '',
    fecha: '',
    idCliente: 0
  });

  carritoProductos = signal<ProductoConPrecio[]>([]);
  total = signal<number>(0);
  descuento = computed(() => {
    if (this.total() >= 100) {
      let s: number = this.total() * 0.05;
      return Math.round(s * 100 / 100);
    } else {
      return 0;
    }
  })

  public registrarCarrito(total: number, estado: string, fecha: string, idCliente: number): Observable<any> {
    const body = {
      total: total,
      estado: estado,
      fecha: fecha,
      idCliente: idCliente
    }
    return this.http.post<Carrito>(`${this.apiUrl}${this.complementoUrl}/registrar`, body);
  }

  public obtenerCarrito(id: number): Observable<any> {
    return this.http.get<Carrito>(`${this.apiUrl}${this.complementoUrl}/obtenerByClient`, {
      params: {
        id: id
      }
    });
  }

  existeCarritoActual(idCliente: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}${this.complementoUrl}/verificar`, {
      params: {
        id: idCliente
      }
    })
  }

  constructor() { }

}
