import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackupAutoService } from '../services/backup-auto.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front_ERP_Supermercado';
  constructor(
    private backupAutoService: BackupAutoService // ⬅ Lo inyectas aquí
  ) {
    // No necesitas llamar a ningún método
    // Solo con inyectarlo en el constructor, su lógica se ejecuta automáticamente al inicializar la app
  }
}
