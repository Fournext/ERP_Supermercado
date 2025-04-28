import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";
import { Observable } from "rxjs";
import { turno } from "../interface/turno";

@Injectable({
    providedIn: 'root'
})
export class TurnoService {
    private myAppUrl: String;
    private myApiUrl: String;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'turno';
    }

    listaTunos(): Observable<turno[]> {
        return this.http.get<turno[]>(`${this.myAppUrl}${this.myApiUrl}/listar`);
    }

    crearTurno(t: turno): Observable<turno> {
        return this.http.post<turno>(`${this.myAppUrl}${this.myApiUrl}/crear`, t);
    }
    actualizarTurno(id: number, t: turno): Observable<turno> {
        return this.http.put<turno>(`${this.myAppUrl}${this.myApiUrl}/actualizar/${id}`, t);
    }

    eliminarTurno(id: number): Observable<turno> {
        return this.http.delete<turno>(`${this.myAppUrl}${this.myApiUrl}/eliminar/${id}`);
    }

    obtenerTurno(id: number): Observable<turno> {
        return this.http.get<turno>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
    }
}