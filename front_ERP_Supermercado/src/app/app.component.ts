import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BackupAutoService } from '../services/backup-auto.service';
import { CommonModule } from '@angular/common';
import { LoteService } from '../services/lote.service';
import { filter } from 'rxjs';
import { Lote } from '../interface/lote';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front_ERP_Supermercado';
  alertasStock: Lote[] = [];

  constructor(
    private backupAutoService: BackupAutoService,
    private loteService: LoteService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Ejecutar al iniciar si corresponde
    if (this.debeMostrarAlertas()) {
      this.verificarStockInicial();
    }

    // Detectar navegación dentro del sistema
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        if (url === '/inventario' || (url !== '/login' && this.alertasStock.length === 0 && this.isLoggedIn())) {
          this.verificarStockInicial(); // ✅ Solo en inventario o al entrar al sistema por primera vez
        }
      });
  }

  cerrarAlerta(index: number): void {
    this.alertasStock.splice(index, 1);
  }

  verificarStockInicial(): void {
    this.loteService.getLotes().subscribe((lotes) => {
      this.alertasStock = lotes.filter(l => l.stock <= l.stock_minimo);
    });
  }

  debeMostrarAlertas(): boolean {
    const rutaActual = this.router.url;
    const tieneToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    return rutaActual !== '/login' && tieneToken;
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

}
