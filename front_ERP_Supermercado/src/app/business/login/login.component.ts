import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../interface/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
  constructor(
    private _loginservices: LoginService,
    private toastr: ToastrService,
    private router: Router,
  ) { }


  async login() {
    
    const user: User = {
     username: this.username,
     password: this.password
    };
 
    this._loginservices.login(user).subscribe({
     next: (response: any) => {  // Usamos 'any' para flexibilidad
       // Extrae el token del objeto de respuesta
       const token = response.token;  // Acceso directo a la propiedad
       if (token) {
         localStorage.setItem('token', token);  // Guarda solo el string
         this.toastr.success("¡Bienvenido!", "Éxito");
         this.router.navigate(['/dashboard']);  // Redirige al dashboard
       } else {
         this.toastr.error("No se recibió el token", "Error");
       }
     },
     error: (e: HttpErrorResponse) => {
       const errorMessage = e.error?.detail || 
                           e.error?.message || 
                           'Error al iniciar sesión';
       
       this.toastr.error(errorMessage, "Error", {
         positionClass: 'toast-bottom-right',
         timeOut: 3000
       });
     }
   });
   }
}
