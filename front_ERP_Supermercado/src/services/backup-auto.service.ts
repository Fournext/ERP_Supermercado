import { Injectable } from '@angular/core';
import { BackupService } from './backup.service';
import { BitacoraService } from './bitacora.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BackupAutoService {

  private intervalId: any;
  private yaDescargadoEsteMinuto = false;
  username: string = '';

  constructor(
    private backupService: BackupService,
    private bitacoraService: BitacoraService,
    private toastr: ToastrService
  ) {
    if (typeof window !== 'undefined') {  // ✔ asegura entorno navegador
      // Esperar unos segundos para asegurar carga total del usuario y token
      setTimeout(() => {
        this.obtenerUsernameDeToken();
        this.iniciarBackupAutomatico();
      }, 3000); // 3 segundos de espera inicial segura
    }
  }

  iniciarBackupAutomatico() {
    this.intervalId = setInterval(() => {
      const now = new Date();
      const dia = now.getDay(); // 5 = viernes
      const hora = now.getHours();
      const minutos = now.getMinutes();

      if (dia === 5 && hora === 23 && minutos === 50) { // viernes a las 23:50
        if (!this.yaDescargadoEsteMinuto && this.username) {
          this.descargarBackupSilencioso();
          this.yaDescargadoEsteMinuto = true;
        }
      } else {
        this.yaDescargadoEsteMinuto = false;
      }
    }, 60000); // cada minuto
  }

  descargarBackupSilencioso() {
    const fechaOriginal = this.obtenerFechaHoraActual();
    const fechaSegura = fechaOriginal.replace(/[\/:]/g, '_');
    const nombreArchivoDescargado = 'backup_' + fechaSegura + '.sql';

    this.backupService.backupSoloDatosSql().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivoDescargado;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.backupService.crearRegBackup({
          username: this.username,
          nombre_archivo: nombreArchivoDescargado,
          fecha: fechaOriginal,
          tipo: 'Automático'
        }).subscribe(() => {
          this.bitacoraService.ActualizarBitacora('Backup automático ejecutado: ' + nombreArchivoDescargado);
          this.toastr.success('Backup automático generado y registrado.', 'Automático');
        }, () => {
          this.toastr.error('Error al registrar el backup en bitácora.', 'Automático');
        });
      },
      error: () => {
        this.toastr.error('Error al generar backup automático', 'Automático');
      }
    });
  }

  obtenerFechaHoraActual(): string {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');
    return `${fecha} ${hora}`;
  }

  obtenerUsernameDeToken() {
    try {
      if (window.localStorage) {
        const token = localStorage.getItem('token');
        if (token) {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            this.username = payload.sub || '';
          }
        }
      }
    } catch (error) {
      console.error('No se pudo obtener el username del token:', error);
      this.username = '';
    }
  }

}
