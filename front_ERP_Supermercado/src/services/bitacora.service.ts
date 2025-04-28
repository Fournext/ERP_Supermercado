import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Bitacora } from '../interface/bitacora';


@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'bitacora';
    this.obtenerIP();
  }

  username: string = '';
  IP: string = "";


  private newBitacora(bitacora: Bitacora):Observable<void>{
    console.log(bitacora);
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/cargar`,bitacora);
  }

  getBitacora():Observable<Bitacora[]>{
    return this.http.get<Bitacora[]>(`${this.myAppUrl}${this.myApiUrl}/getBitacoras`); 
  }


  ActualizarBitacora(descripcion:string){
    this.obtenerIP();
    this.getUsernameFromToken()
    const bitacora:Bitacora={
      username:this.username,
      ip:this.IP,
      fecha:this.obtenerFechaHoraActual(),
      descripcion: descripcion
    } 
    this.newBitacora(bitacora).subscribe()
  }


  obtenerFechaHoraActual(): string {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');
    return `${fecha} ${hora}`;
  }

  obtenerIP(): void {
    this.http.get<any>('https://api.ipify.org/?format=json').subscribe({
      next: (response) => {
        this.IP = response.ip; 
      },
      error: (error) => {
        this.toastr.error('Error al obtener IP', error.message || error);
      }
    });
  }

  getUsernameFromToken() {
    const token = localStorage.getItem('token'); 
    if (token) {
      const tokenParts = token.split('.'); 
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1])); 
        this.username = payload.sub; 
       
      } else {
        this.toastr.error('El token no tiene el formato esperado.','Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.','Error');
    }
  }
  
}
