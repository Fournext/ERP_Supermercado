import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BoletaCompra, DetalleCompra } from '../interface/compras.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = environment.endpoint;
  private http = inject(HttpClient);
  private complementoUrl = 'boleta_compra';

  //propiedades para el manejo de datos globales
  verBoleta=signal<boolean>(false);

  listaBoletaCompra = signal<BoletaCompra[]>([]);
  boletaCompraActual = signal<BoletaCompra>({
    idBoletaCompra: 0,
    costoTotal: 0.0,
    fecha: '00/00/00',
    idProveedor: 0,
    idMetodoPago: 0,
    estado: ''
  });
  listaDetalleActual=signal<DetalleCompra[]>([]);

  verBoletaSwitch(){
    this.verBoleta.set(!this.verBoleta());
  }

  getBoletaCompras() {
    this.http.get<BoletaCompra[]>(`${this.apiUrl}${this.complementoUrl}/listar`).subscribe(
      (response) => {
        const listaBoletas: BoletaCompra[] = response.map((boleta) => {
          const boletaActual: BoletaCompra = {
            idBoletaCompra: boleta.idBoletaCompra,
            costoTotal: boleta.costoTotal,
            fecha: boleta.fecha,
            idProveedor: boleta.idProveedor,
            idMetodoPago: boleta.idMetodoPago,
            estado: boleta.estado
          }
          return boletaActual;
        })
        this.listaBoletaCompra.set(listaBoletas);
      }
    )
  }

  registrarBoletaCompra(costoTotal: number, fecha: string, idProveedor: number, idMetodoPago: number, estado: string): Observable<any> {
    const body = {
      costoTotal: costoTotal,
      fecha: fecha,
      idProveedor: idProveedor,
      idMetodoPago: idMetodoPago,
      estado: estado
    }
    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/registrar`, body).pipe(
      tap(() => {//tap es una funcion que se encarga de ejecutar efectos, sin modificar los datos de la respuesta
        this.getBoletaCompras();
      })
    )
  }

  editarBoletaCompra(id: number, idBoletaCompra: number, costoTotal: number, fecha: string, idProveedor: number, idMetodoPago: number, estado: string) {
    const body = {
      idBoletaCompra: idBoletaCompra,
      costoTotal: costoTotal,
      fecha: fecha,
      idProveedor: idProveedor,
      idMetodoPago: idMetodoPago,
      estado: estado
    }
    console.log(body);
    return this.http.put<any>(`${this.apiUrl}${this.complementoUrl}/editar`, body, {
      params: {
        id: id
      }
    }).pipe(
      tap(() => {//tap es una funcion que se encarga de ejecutar efectos, sin modificar los datos de la respuesta
        this.getBoletaCompras();
      })
    )
  }

  obtenerBoleta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.complementoUrl}/obtener`, {
      params: {
        id: id
      }
    });
  }
  
  constructor() { }

}
