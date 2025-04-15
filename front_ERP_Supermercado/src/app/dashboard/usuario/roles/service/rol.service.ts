import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../../../../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:3005/api/rol';

  constructor(private http: HttpClient){}

  listarRoles(): Observable<Rol[]>{
      return this.http.get<Rol[]>(`${this.apiUrl}/listar`)
  }

  crearRol(rol: Rol):Observable<Rol>{
      return this.http.post<Rol>(`${this.apiUrl}/crear`, rol);
  }

  actualizarRol(rol: Rol){
    return this.http.put(`${this.apiUrl}/actualizar/${rol.id}`, rol);
  }

  eliminarRol(id: number){
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }
}
  

  