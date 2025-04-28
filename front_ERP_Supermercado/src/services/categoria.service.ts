import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Categoria } from '../interface/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'categoria';
  //propiedades que tendran los datos a nivel global
  public listaCategorias = signal<Categoria[]>([]);
  //falta el producto actual
  //falta el producto actualizar



  public obtenerCategorias() {
    this.http.get<Categoria[]>(`${this.apiUrl}${this.complementoUrl}/listar`).subscribe(
      (response) => {
        const listaCategoria: Categoria[] = response.map((categoria) => {
          const categoriaActual: Categoria = {
            id_categoria: categoria.id_categoria,
            nombre: categoria.nombre
          }
          return categoriaActual;
        })
        this.listaCategorias.set(listaCategoria);
      }
    )
  }
  public registrarCategoria(nombre: string): Observable<any> {
    const body = {
      nombre: nombre
    }
    console.log(body);
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/crear`, body).pipe(
      tap(() => {
        this.obtenerCategorias();
      })
    )
  }

  public actualizarCategoria(id: number, nuevoNombre: string): Observable<any> {
    const body = {
      id_categoria: id,
      nombre: nuevoNombre
    }
    return this.http.put<any>(`${this.apiUrl}${this.complementoUrl}/actualizar`, body).pipe(
      tap(() => {
        this.obtenerCategorias();
      })
    )
  }
  constructor() { }

}
