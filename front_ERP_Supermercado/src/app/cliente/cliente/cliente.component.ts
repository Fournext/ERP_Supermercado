import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../services/bitacora.service';
import { LoginService } from '../../../services/login.service';

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


  private id:number=1;
  nombre=signal<string>('');
  apellido=signal<string>('');
  carnet=signal<string>('');
  nit=signal<string>('');
  direccion=signal<string>('');

  volverHome() {
    this.router.navigate(['/ecommerce']);
  }

}
