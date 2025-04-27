import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Imagen } from '../interface/imagen.interface';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private router = inject(Router);

  //lista de imagenes
  public listaImagenes = signal<Imagen[]>([]);
  //imagen actual
  public imagenActual = signal<Imagen>({
    idImagen: 0,
    url: '',
    idProducto: 0
  });

  public obtenerTodasLasImagenes() {
    this.http.get<Imagen[]>(`${this.apiUrl}imagenes/listar`).subscribe((resp) => {
      const listaDeImagenes: Imagen[] = resp.map((imagen) => {
        const imagenDate: Imagen = {
          idImagen: imagen.idImagen,
          url: imagen.url,
          idProducto: imagen.idProducto
        }
        return imagenDate;
      })
      this.listaImagenes.set(listaDeImagenes);
      console.log(listaDeImagenes);
    })
  }
  public registrarImagen(url: string, idProducto: number) {
    const body = {
      url: url,
      idProducto: idProducto
    }
    console.log({ body });
    this.http.post<any>(`${this.apiUrl}imagenes/insertar`, body).subscribe((resp) => {
      this.obtenerTodasLasImagenes();
    }
    );
  }
  constructor() { }

}
