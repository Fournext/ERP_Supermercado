import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { Sector } from '../interface/sector';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'sector';
  }

  newSector(sector: Sector):Observable<void>{
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,sector); 
  }

  editarSector(sector: Sector):Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/editar/${sector.id_sector}`,sector); 
  }

  getSectores():Observable<Sector[]>{
    return this.http.get<Sector[]>(`${this.myAppUrl}${this.myApiUrl}/getSectores`); 
  }

  getSector(id: number):Observable<Sector[]>{
    return this.http.get<Sector[]>(`${this.myAppUrl}${this.myApiUrl}/getSector/${id}`); 
  }

  deleteSector(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }
}
