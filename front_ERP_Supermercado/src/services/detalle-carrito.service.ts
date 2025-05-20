import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DetalleCarrito } from '../interface/carrito';

@Injectable({
  providedIn: 'root'
})
export class DetalleCarritoService {

  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'detalle-carrito';

  listaDetalleCarritoActual=signal<DetalleCarrito[]>([]);

  registrarDetalleCarrito(cantidad: number, precio: number, subtotal: number, idProducto: number, idCarrito: number, url: string,descripcion:string) {
    const body = {
      cantidad: cantidad,
      precio: precio,
      subtotal: subtotal,
      idProducto: idProducto,
      idCarrito: idCarrito,
      url: url,
      descripcion:descripcion
    }
    this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/registrar`, body).subscribe(
      (response) => {
        console.log('registro exitoso');
      }
    )
  }
  obtenerDetalleCarrito(id:number){
    this.http.get<any>(`${this.apiUrl}${this.complementoUrl}/obtener-by-carrito`,{
      params:{
        id:id
      }
    }).subscribe((response)=>{
      this.listaDetalleCarritoActual.set(response);
    });
  }


  constructor() { }

}
