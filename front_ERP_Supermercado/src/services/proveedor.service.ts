import { inject, Injectable, signal } from '@angular/core';
import { Proveedor, ProveedorInsertar } from '../interface/proveedore.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'proveedor/';

  public listaProveedor = signal<Proveedor[]>([]);
  public proveedorActual = signal<Proveedor>({
    idProveedor: 0,
    nombre: '',
    direccion: '',
    estado: ''
  });

  //vamos a obtener todos los datos para luego almacenarlos en el localStorage
  public obtenerListaProveedores() {
    return this.http.get<Proveedor[]>(`${this.apiUrl}${this.complementoUrl}listar`).subscribe((response) => {
      const listaProveedor: Proveedor[] = response.map((proveedor: Proveedor) => {
        const proveedorActual: Proveedor = {
          idProveedor: proveedor.idProveedor,
          nombre: proveedor.nombre,
          direccion: proveedor.direccion,
          estado: proveedor.estado
        }
        return proveedorActual;
      })
      this.listaProveedor.set(listaProveedor);
    })
  }

  public registrarProveedor(nombre: string, direccion: string, estado: string): Observable<any> {
    const body: ProveedorInsertar = {
      nombre: nombre,
      direccion: direccion,
      estado: estado
    }
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}registrar`, body).pipe(
      tap(() => {
        this.obtenerListaProveedores();
      })
    )
  }

  public actualizarProveedor(id: number, nombre: string, direccion: string, estado: string): Observable<any> {
    const body: ProveedorInsertar = {
      nombre: nombre,
      direccion: direccion,
      estado: estado
    }
    return this.http.put<any>(`${this.apiUrl}${this.complementoUrl}actualizar`,
      body,
      {
        params: {
          id: id
        }
      }).pipe(
        tap(()=>{
          this.obtenerListaProveedores();
        })
      );
  }

  constructor() { }

}
