import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';
import { Almacen } from '../interface/almacen';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'almacen';
  }

  newAlmacen(almacen: Almacen):Observable<void>{
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,almacen); 
  }

  editarAlmacen(almacen: Almacen):Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/editar/${almacen.id_almacen}`,almacen); 
  }

  getAlmacenes():Observable<Almacen[]>{
    return this.http.get<Almacen[]>(`${this.myAppUrl}${this.myApiUrl}/getAlmacenes`); 
  }

  getAlmacen(id: number):Observable<Almacen[]>{
    return this.http.get<Almacen[]>(`${this.myAppUrl}${this.myApiUrl}/getAlmacen/${id}`); 
  }

  deleteAlmacen(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }

}
