import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { BoletaRecepcion } from '../interface/boleta_recepcion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletaRecepcionService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'boleta_recepcion';
  }

  newBoleta_Recepcion(boleta_recepcion: BoletaRecepcion):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,boleta_recepcion); 
  }

  actualizarBoleta_Recepcion(boleta_recepcion: BoletaRecepcion):Observable<void>{
    console.log(boleta_recepcion.idBoleta);
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/actualizar/${boleta_recepcion.idBoleta}`,boleta_recepcion); 
  }

  getBoletas_Recepcion():Observable<BoletaRecepcion[]>{
    return this.http.get<BoletaRecepcion[]>(`${this.myAppUrl}${this.myApiUrl}/listar`); 
  }

  getBoleta_Recepcion(id: number):Observable<BoletaRecepcion>{
    return this.http.get<BoletaRecepcion>(`${this.myAppUrl}${this.myApiUrl}/listar/${id}`); 
  }

  deleteBoleta_Recepcion(id: number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`); 
  }

  existeValoracion(id_factura: number):Observable<Boolean>{
    return this.http.get<Boolean>(`${this.myAppUrl}${this.myApiUrl}/existe_val/${id_factura}`); 
  }

  getBoleta_Recepcion_por_Factura(id: number):Observable<BoletaRecepcion>{
    return this.http.get<BoletaRecepcion>(`${this.myAppUrl}${this.myApiUrl}/listar_porfactura/${id}`); 
  }
}
