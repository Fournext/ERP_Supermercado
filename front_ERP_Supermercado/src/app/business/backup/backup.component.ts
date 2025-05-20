import { Component, OnInit } from '@angular/core';
import { BackupService } from '../../../services/backup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Backup } from '../../../interface/backup';
import { BitacoraService } from '../../../services/bitacora.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.css'
})
export default class BackupComponent implements OnInit {

  

  constructor(
    private backupService: BackupService,
    private toastr: ToastrService,
    private bitacoraService: BitacoraService
  ) { }

  backups: Backup[] = [];
  new_backup: Backup = {
    id: 0,
    username: '',
    nombre_archivo: '',
    fecha: '',
    tipo: ''
  };
  cargando = false; 
  nombreArchivoDescargado: string = '';
  fechaOriginal: string = '';
  username: string = '';

  ngOnInit(): void {
    this.getUsernameFromToken()
    this.getListBackups();
  }

  crearRegBackup(_nombre_archivo:string, _tipo:string) {
    this.new_backup = {
      username: this.username,
      nombre_archivo: _nombre_archivo,
      fecha: this.fechaOriginal,
      tipo: _tipo
    }
    this.backupService.crearRegBackup(this.new_backup).subscribe((data)=>{
      this.getListBackups();
    });
  }

  getListBackups() {
    this.backupService.ListRegBackup().subscribe((data) => {
      this.backups = data;
    }, (error: HttpErrorResponse) => {
      this.toastr.error('Error al obtener la lista de backups', 'Error');
    });
  }

  descargarBackup() {
    this.fechaOriginal = this.obtenerFechaHoraActual();
    const fechaSegura = this.fechaOriginal.replace(/[\/:]/g, '_'); // Cambiar / y : por _
    this.nombreArchivoDescargado = 'backup_' + fechaSegura + '.sql';

    this.cargando = true;
    this.backupService.backupSoloDatosSql().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.nombreArchivoDescargado;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      this.cargando = false;

      // Ahora sí preguntar si guardó efectivamente
      Swal.fire({
        title: '¿Confirmar descarga?',
        text: "¿Ha guardado correctamente el archivo "+this.nombreArchivoDescargado+"?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardé',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.crearRegBackup(this.nombreArchivoDescargado, 'Guardar');
          this.toastr.success('Backup registrado en bitácora.', 'Confirmado');
          this.bitacoraService.ActualizarBitacora('Descargo backup: ' + this.nombreArchivoDescargado);
        } else {
          this.toastr.info('No se registró el backup porque no fue confirmado.', 'Cancelado');
        }
      });

    }, (error: HttpErrorResponse) => {
      this.toastr.error('Error al descargar backup', 'Error');
      this.cargando = false;
    });
  }


  restaurarBackup(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.cargando = true;
      this.backupService.restaurarDesdeSql(archivo).subscribe(response => {
        this.fechaOriginal = this.obtenerFechaHoraActual();
        this.crearRegBackup(archivo.name, 'Restaurar');
        this.toastr.success('Restauración completada.', 'Éxito');
        this.bitacoraService.ActualizarBitacora('Restauró backup: ' + archivo.name);
        this.cargando = false;
      }, (error: HttpErrorResponse) => {
        this.toastr.error('Error al restaurar backup', 'Error');
        this.cargando = false;
      });
    } 
  }

  obtenerFechaHoraActual(): string {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');
    return `${fecha} ${hora}`;
  }

  getUsernameFromToken() {
    const token = localStorage.getItem('token'); 
    if (token) {
      const tokenParts = token.split('.'); 
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1])); 
        this.username = payload.sub; 
       
      } else {
        this.toastr.error('El token no tiene el formato esperado.','Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.','Error');
    }
  }

}
