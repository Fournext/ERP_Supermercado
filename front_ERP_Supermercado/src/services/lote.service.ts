import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { Lote } from '../interface/lote';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'lote';
  }
  //datos
  listaLotes=signal<Lote[]>([]);//lo necesito para no estar haciendo peticiones a lo loco


  newLote(lote: Lote):Observable<void>{
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,lote); 
  }

  editarLote(lote: Lote):Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/editar`,lote); 
  }

  getLotes():Observable<Lote[]>{
    return this.http.get<Lote[]>(`${this.myAppUrl}${this.myApiUrl}/getLotes`); 
  }

  getLote(id: number):Observable<Lote>{
    return this.http.get<Lote>(`${this.myAppUrl}${this.myApiUrl}/getLote/${id}`); 
  }

  deleteLote(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }
}
