import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { User } from '../../interface/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  success: boolean = false;
  constructor(
    private _loginservices: LoginService,
    private toastr: ToastrService,
  ) { }


  async login() {
    
   const user: User = {
    username: this.username,
    password: this.password
   };

   this._loginservices.login(user).subscribe({
      next: async(token)=> {
        localStorage.setItem('token', token);
        this.toastr.success("Bienvenido")
        this.success = true;
      },
      error: (e: HttpErrorResponse) => {
        this.toastr.error(e.error?.message,"",{
          positionClass: 'toast-bottom-right',  // Posicion
          timeOut: 3000  // Tiempo de duración 
        });
      }
   })
  }
}
