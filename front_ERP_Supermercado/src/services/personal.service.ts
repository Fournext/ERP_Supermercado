import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { personal } from "../interface/personal";
import { environment } from "../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class PersonalService {
    private myAppUrl: String;
    private myApiUrl: String;
    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'personal';
    }

    listarPersonal(): Observable<personal[]> {
        return this.http.get<personal[]>(`${this.myAppUrl}${this.myApiUrl}/listar`);
    }

    crearPersonal(p: personal): Observable<personal> {
        return this.http.post<personal>(`${this.myAppUrl}${this.myApiUrl}/crear`,p);
    }

    eliminarPersonal(id: number): Observable<personal> {        
        return this.http.delete<personal>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`);
    }

    actualizarPersonal(id: number, p: personal): Observable<personal> {
        return this.http.put<personal>(`${this.myAppUrl}${this.myApiUrl}/actualizar/${id}`, p);
    }

    eliminarPersonalByEstado(idPersonal: number, fecha: string, motivo: string): Observable<any> {
        const body = { idPersonal, fecha, motivo };
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/eliminarPersonalByEstado`, body, { headers });
      }
}