import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { User } from '../interface/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'auth';
   }

  login(user: User):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`,user);
  }
  register(user: User):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/register`,user);
  }

  getUser(username: string):Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}usuarios/getUser/${username}`);
  }
}
