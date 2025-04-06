import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  login() {
    // Simulación: puedes cambiar esto por autenticación real
    if (this.username === 'FRX' && this.password === '123456') {
      this.success = true;
      this.error = '';
    } else {
      this.success = false;
      this.error = 'Correo o contraseña incorrectos.';
    }
  }
}
