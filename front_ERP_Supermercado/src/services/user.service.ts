import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.development";
import { User } from "../interface/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private myAppUrl: String;
    private myApiUrl: String;
    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'usuarios';
    }

    listarUsuarios(): Observable<User[]> {
        return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}/getUsers`);
    }
    getUsuario(username: string): Observable<User> {
        return this.http.get<User>(`${this.myAppUrl}${this.myApiUrl}/getUser/${username}`);
    }

    verifRol(username: string): Observable<any> {
        console.log(username)
        return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/rol/${username}`);
    }
}