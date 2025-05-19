import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenCheckInterval = 60000; // 1 minuto

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private toastr: ToastrService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startTokenWatch(); // Solo se activa en el navegador
    }
  }

  private startTokenWatch(): void {
    setInterval(() => {
      this.checkToken();
    }, this.tokenCheckInterval);
  }

  checkToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token) as { exp: number };
          if (decoded.exp * 1000 < Date.now()) {
            this.handleExpiredToken();
          }
        } catch (e) {
          this.handleExpiredToken();
        }
      }
    }
  }

  private handleExpiredToken(): void {
    localStorage.removeItem('token');
    this.toastr.error('Sesión expirada', '', {
      positionClass: 'toast-bottom-right',
      timeOut: 3000
    });
    this.router.navigate(['/login']);
  }
}
