import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Marca } from '../interface/marca.interface';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'marca';
  //propiedades que tendran los datos a nivel global
  public listaMarcas = signal<Marca[]>([]);
  //falta el producto actual
  //falta el producto actualizar



  public obtenerMarcas() {
    this.http.get<Marca[]>(`${this.apiUrl}${this.complementoUrl}/listar`).subscribe(
      (response) => {
        const listaMarcas: Marca[] = response.map((marca) => {
          const marcaActual: Marca = {
            id_marca:marca.id_marca,
            nombre:marca.nombre
          }
          return marcaActual;
        })
        this.listaMarcas.set(listaMarcas);
      }
    )
  }
  public registrarMarca(nombre:string): Observable<any> {
    const body = {
      nombre:nombre
    }
    console.log(body);
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/crear`, body).pipe(
      tap(() => {
        this.obtenerMarcas();
      })
    )
  }

  public actualizarMarca(id:number,nuevoNombre:string):Observable<any>{
    const body={
      id_marca:id,
      nombre:nuevoNombre
    }
    return this.http.put<any>(`${this.apiUrl}${this.complementoUrl}/actualizar`,body).pipe(
     tap(()=>{
      this.obtenerMarcas();
     })
    )
  }
  constructor() { }

}
