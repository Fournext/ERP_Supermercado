import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Encargado, EncargadoRegister } from '../interface/encargado.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncargadoService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'encargado';

  modalRegister = signal<boolean>(false);
  modalEnviar=signal<boolean>(false);



  cambiarEstadoModal() {
    this.modalRegister.set(!this.modalRegister());
  }
  cambiarEstadoModalEnviar() {
    this.modalEnviar.set(!this.modalEnviar());
  }

  registrarEncargado(encargado: EncargadoRegister): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/registrar`, encargado).pipe(
      tap(() => {
        this.listarEncargados();
      })
    )
  }

  listarEncargados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.complementoUrl}/listar`);
  }

  enviarNotificaciones(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/probarNotificacion`, {}, {
      params: {
        id: id
      }
    })
  }

  constructor() { }

}
