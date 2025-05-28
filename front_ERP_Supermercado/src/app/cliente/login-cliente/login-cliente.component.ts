import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../interface/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { BitacoraService } from '../../../services/bitacora.service';
import { UserService } from '../../../services/user.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-cliente.component.html',
})
export default class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  success: boolean = false;
  constructor(
    private _loginservices: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private _bitacoraservices: BitacoraService,
    private _userservices: UserService,
    private _clienteService: ClienteService
  ) { }


  async login() {
    const user: User = {
      username: this.username,
      password: this.password
    };
    this._loginservices.login(user).subscribe({
      next: (response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.ObtenerCliente(user.username);
          this._bitacoraservices.ActualizarBitacora("Inicio de Sesion");
          this.toastr.success("¡Bienvenido!", "Éxito");
          this.router.navigate(['/ecommerce']);
        } else {
          this.toastr.error("No se recibió el token", "Error");
        }
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail || e.error?.message || 'Error al iniciar sesión';
        this.toastr.error(errorMessage, "Error", {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        });
      }
    });
  }

  ObtenerCliente(user: string) {
    this._userservices.getUsuarioByUserName(user).subscribe(
      (response: User) => {
        console.log(response);
        const usuarioActual: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          password: ''
        }
        this._userservices.usuarioActual.set(usuarioActual);
        this._clienteService.obtenerClienteByUser(usuarioActual.id || 1);
      }
    )
  }
}
