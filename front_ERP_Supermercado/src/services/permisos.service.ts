import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Permiso } from '../interface/permiso';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'permisos';
  }

  newPermiso(permiso: Permiso):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,permiso); 
  }

  editarPermiso(permiso: Permiso):Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/editar/${permiso.id_permiso}`,permiso); 
  }

  getPermisos():Observable<Permiso[]>{
    return this.http.get<Permiso[]>(`${this.myAppUrl}${this.myApiUrl}/getPermisos`); 
  }

  getPermisoRol(id: number):Observable<Permiso[]>{
    return this.http.get<Permiso[]>(`${this.myAppUrl}${this.myApiUrl}/getPermisoRol/${id}`); 
  }

  getPermiso(id: number):Observable<Permiso[]>{
    return this.http.get<Permiso[]>(`${this.myAppUrl}${this.myApiUrl}/getPermiso/${id}`); 
  }

  deletePermiso(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }
}
