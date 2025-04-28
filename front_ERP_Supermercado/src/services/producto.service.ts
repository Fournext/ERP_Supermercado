import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { Observable, tap } from 'rxjs';
import { ProductoConPrecio } from '../interface/producto.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  //propiedades para las enviroments
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'producto';
  //propiedades que tendran los datos a nivel global
  public listaProductos = signal<ProductoConPrecio[]>([]);
  //falta el producto actual
  //falta el producto actualizar



  public obtenerProductos() {
    this.http.get<ProductoConPrecio[]>(`${this.apiUrl}${this.complementoUrl}/listarProductosPrecio`).subscribe(
      (response) => {
        const listaProductos: ProductoConPrecio[] = response.map((producto) => {
          const productoActual: ProductoConPrecio = {
            idProducto: producto.idProducto,
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            marca: producto.marca,
            categoria: producto.categoria,
            tipo_producto: producto.tipo_producto,
            precio: producto.precio
          }
          return productoActual;
        })
        this.listaProductos.set(listaProductos);
      }
    )
  }
  public registrarProducto(codigo: string, descripcion: string, idMarca: number, idCategoria: number, idTipo: number, precioUnitario: number): Observable<any> {
    const body = {
      codigo: codigo,
      descripcion: descripcion,
      idMarca: idMarca,
      idCategoria: idCategoria,
      idTipo: idTipo,
      precioUnitario: precioUnitario
    }
    console.log(body);
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/crear_con_precio`, body).pipe(
      tap(() => {
        this.obtenerProductos();
      })
    )
  }

  public actualizarProducto(id: number, codigo: string, descripcion: string, idMarca: number, idCategoria: number, idTipo: number, precioUnitario: number): Observable<any> {
    const body = {
      idProducto: id,
      codigo: codigo,
      descripcion: descripcion,
      idMarca: idMarca,
      idCategoria: idCategoria,
      idTipo: idTipo,
      precioUnitario: precioUnitario
    }
    console.log(body);
    return this.http.put<any>(`${this.apiUrl}${this.complementoUrl}/editar`,body).pipe(
      tap(() => {
        this.obtenerProductos();
      })
    )
  }


  constructor() { }

}
