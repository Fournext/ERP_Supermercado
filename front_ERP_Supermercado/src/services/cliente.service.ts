import { Injectable, signal } from '@angular/core';
import { Cliente } from '../interface/cliente';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private myAppUrl: String;
  private myApiUrl: String;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'cliente';
  }

  clienteActual = signal<Cliente>({
    idCliente: 0,
    nombreCliente: '',
    nombreApellido: '',
    carnetCliente: '',
    nitCliente: '',
    direccionCliente: '',
    idUsuario: 0,
    estadoClienteId: 0
  });

  registrarCliente(cliente: Cliente) {
    console.log('Cliente');
    console.log(cliente);
    this.http.post<Cliente>(`${this.myAppUrl}${this.myApiUrl}/registrar`, cliente).subscribe(
      (response: Cliente) => {
        this.clienteActual.set(response);
      }
    )
  }

 obtenerClienteByUser(idUser: number) {
  console.log("Solicitando cliente con ID:", idUser);
  this.http.get<Cliente>(`${this.myAppUrl}${this.myApiUrl}/obtenerByUser`, {
    params: {
      id: idUser.toString()
    }
  }).subscribe({
    next: (response) => {
      console.log("Cliente recibido:", response);
      this.clienteActual.set(response);
    },
    error: (err) => {
      console.error("Error al obtener cliente:", err);
    }
  });
}



}
