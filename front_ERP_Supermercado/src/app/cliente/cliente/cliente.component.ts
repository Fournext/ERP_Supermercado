import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../services/bitacora.service';
import { LoginService } from '../../../services/login.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente',
  imports: [],
  templateUrl: './cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteComponent {
  private bitacoraService = inject(BitacoraService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private clienteService=inject(ClienteService);


  private id:number=1;
  nombre=signal<string>(this.clienteService.clienteActual().nombreCliente);
  apellido=signal<string>(this.clienteService.clienteActual().nombreApellido);
  carnet=signal<string>(this.clienteService.clienteActual().carnetCliente);
  nit=signal<string>(this.clienteService.clienteActual().nitCliente);
  direccion=signal<string>(this.clienteService.clienteActual().direccionCliente);

  volverHome() {
    this.router.navigate(['/ecommerce']);
  }


}
