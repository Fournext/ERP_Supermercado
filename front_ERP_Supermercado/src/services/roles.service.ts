import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment.development";
import { rol } from "../interface/roles";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class RolesService {
    private myAppUrl: String;
    private myApiUrl: String;
    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'rol';
    }

    listarRoles():  Observable<rol[]> {
        return this.http.get<rol[]>(`${this.myAppUrl}${this.myApiUrl}/listar`);
    }
}