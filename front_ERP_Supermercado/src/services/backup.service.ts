import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';
import { Backup } from '../interface/backup';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private http: HttpClient,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'backup';
  }

  crearRegBackup(backup: Backup):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/crear`,backup); 
  }

  ListRegBackup():Observable<Backup[]>{
    return this.http.get<Backup[]>(`${this.myAppUrl}${this.myApiUrl}/getListBackups`); 
  }

  backupSoloDatosSql(): Observable<Blob> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/solo-datos-sql`, {
      responseType: 'blob'
    });
  }

  restaurarDesdeSql(archivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/restaurar-sql`, formData, {
      responseType: 'text'
    });
  }
}
