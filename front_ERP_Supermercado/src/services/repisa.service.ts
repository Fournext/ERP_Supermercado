import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { Repisa } from '../interface/repisa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepisaService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'repisa';
  }

  newRepisa(repisa: Repisa):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,repisa); 
  }

  editarRepisa(repisa: Repisa):Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/editar/${repisa.id_repisa}`,repisa); 
  }

  getRepisas():Observable<Repisa[]>{
    return this.http.get<Repisa[]>(`${this.myAppUrl}${this.myApiUrl}/getRepisas`); 
  }

  getRepisa(id: number):Observable<Repisa[]>{
    return this.http.get<Repisa[]>(`${this.myAppUrl}${this.myApiUrl}/getRepisa/${id}`); 
  }

  deleteRepisa(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }

}
