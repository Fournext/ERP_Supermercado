import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { BitacoraService } from '../../../services/bitacora.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interface/user';
import { HttpErrorResponse } from '@angular/common/http';
import { Cliente } from '../../../interface/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { CarritoService } from '../../../services/carrito.service';

@Component({
  selector: 'app-register-cliente',
  imports: [RouterLink],
  templateUrl: './register-cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterClienteComponent {
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private bitacoraService = inject(BitacoraService);
  private userService = inject(UserService);
  private clienteService = inject(ClienteService);
  private carritoService = inject(CarritoService);


  //para crear usuarios
  username = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  //para crear cliente
  nombreCliente = signal<string>('');
  apellidoCliente = signal<string>('');
  carnetCliente = signal<string>('');
  NitCliente = signal<string>('');
  direccionCliente = signal<string>('');
  estadoCliente = 1;
  idUsuario = computed(() => this.userService.usuarioActual().id);

  registrarUsuario() {
    const user: User = {
      username: this.username(),
      email: this.email(),
      password: this.password()
    }

    this.loginService.register(user).subscribe({
      next: (response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.registrarCliente(user.username)
          this.bitacoraService.ActualizarBitacora(`Registro de usuario: ${user.username}`);
          this.toastr.success("¡Bienvenido!", "Éxito");
          this.router.navigate(['/ecommerce']);
        } else {
          this.toastr.error("No se recibió el token", "Error");
        }
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail || e.error?.message || 'Error al crear cuenta';
        this.toastr.error(errorMessage, "Error", {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        });
      }
    });
  }

  registrarCliente(user: string) {
    const cliente: Cliente = {
      nombreCliente: this.nombreCliente(),
      nombreApellido: this.apellidoCliente(),
      carnetCliente: this.carnetCliente(),
      nitCliente: this.NitCliente(),
      direccionCliente: this.direccionCliente(),
      idUsuario: 0,
      estadoClienteId: this.estadoCliente
    }
    this.userService.getUsuarioByUserName(user).subscribe(
      (response: User) => {
        console.log(response);
        const usuarioActual: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          password: ''
        }
        cliente.idUsuario = response.id;
        this.userService.usuarioActual.set(usuarioActual);
        console.log('Usuario actual');
        console.log(usuarioActual);
        this.clienteService.registrarCliente(cliente);
      }
    )
  }

  //vamos a crear un carrito cuando se crea un cliente


}
