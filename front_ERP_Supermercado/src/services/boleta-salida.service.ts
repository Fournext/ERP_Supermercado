import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { BoletaSalida } from '../interface/boleta_salida';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletaSalidaService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'boleta_salida';
  }

  newBoleta_Salida(boleta_salida: BoletaSalida):Observable<void>{
        return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,boleta_salida); 
  }

  getBoletas_Salida():Observable<BoletaSalida[]>{
    return this.http.get<BoletaSalida[]>(`${this.myAppUrl}${this.myApiUrl}/getBoletas_salida`); 
  }

  getBoleta_Salida(id: number):Observable<BoletaSalida>{
    return this.http.get<BoletaSalida>(`${this.myAppUrl}${this.myApiUrl}/getBoleta_salida/${id}`); 
  }

  deleteBoleta_Salida(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }
}
