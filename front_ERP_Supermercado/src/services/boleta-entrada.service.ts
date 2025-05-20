import { inject, Injectable, signal } from '@angular/core';
import { BoletaEntrada, DetalleBoletaEntradaEnviar } from '../interface/boletaEntrada.interface';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletaEntradaService {

  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'boleta_entrada';
  //Datos necesarios
  listaDetalleActual = signal<DetalleBoletaEntradaEnviar[]>([]);
  listaBoletaEntrada = signal<BoletaEntrada[]>([]);

  //datos para el modal
  mostrarModal = signal<boolean>(false);
  //ESTO SE USARA PARA MOSTRAR EL MODAL
  boletaActual = signal<BoletaEntrada>({
    idBoleta: 0,
    fecha: '',
    descripcion: '',
    estado: '',
    idBoletaCompra: 0,
    idPersonal: 0
  });

  getBoletaEntradas() {
    this.http.get<any[]>(`${this.apiUrl}${this.complementoUrl}/listar`).subscribe(
      (response) => {
        const listaBoletas: BoletaEntrada[] = response.map((boleta: BoletaEntrada) => (boleta));
        this.listaBoletaEntrada.set(listaBoletas);
      }
    )
  }

  registrarBoleta(fecha: string, descripcion: string, idBoletaCompra: number, estado: string, idPersonal: number): Observable<any> {
    const body = {
      fecha: fecha,
      descripcion: descripcion,
      idBoletaCompra: idBoletaCompra,
      estado: estado,
      idPersonal: idPersonal
    }
    return this.http.post<BoletaEntrada>(`${this.apiUrl}${this.complementoUrl}/registrar`, body).pipe(
      tap(() => {
        this.getBoletaEntradas();
      })
    )
  }

  eliminarBoleta(id: number) {
    this.http.delete<any>(`${this.apiUrl}${this.complementoUrl}/eliminar`, {
      params: {
        id: id
      }
    }).subscribe((response) => {
      this.getBoletaEntradas();
      console.log(response);
    })
  }

  mostrarModalSwitch() {
    this.mostrarModal.set(!this.mostrarModal());
  }

  constructor() { }

}
