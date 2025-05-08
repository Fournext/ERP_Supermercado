import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../interface/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../services/bitacora.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  success: boolean = false;
  rol='';
  constructor(
    private _loginservices: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private _bitacoraservices: BitacoraService,
    private _userservices: UserService
  ) { }


  async login() {
    const user: User = {
      username: this.username,
      password: this.password
    };
  
    this._userservices.verifRol(this.username).subscribe({
      next: (rolData) => {
        this.rol = rolData.rol;
        this._loginservices.login(user).subscribe({
          next: (response: any) => {
            const token = response.token;
            if (token) {
              localStorage.setItem('token', token);
  
              if (this.rol === 'personal') {
                this._bitacoraservices.ActualizarBitacora("Inicio de Sesion");
                this.toastr.success("¡Bienvenido!", "Éxito");
                this.router.navigate(['/dashboard']);
              } else if (this.rol === 'cliente') {
                this.toastr.success("¡Bienvenido!", "Éxito");
                this.router.navigate(['/ecommerce']);
              } else {
                this.toastr.error("El Usuario no tiene un rol", "Error");
              }
  
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
      },
      error: (e: HttpErrorResponse) => {
        this.toastr.error("No se pudo verificar el rol del usuario", "Error");
      }
    });
  }  
}
