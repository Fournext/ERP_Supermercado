import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { EncargadoService } from '../../../../services/encargado.service';
import { PersonalService } from '../../../../services/personal.service';
import { personal } from '../../../../interface/personal';
import { EncargadoRegister } from '../../../../interface/encargado.interface';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'forumlario-register-encargado',
  imports: [CommonModule],
  templateUrl: './forumlario-register-encargado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumlarioRegisterEncargadoComponent {
  private encargadoService = inject(EncargadoService);
  private personalService = inject(PersonalService);
  private toastr = inject(ToastrService);

  nombre = signal<string>('');
  correoNotificacion = signal<string>('');
  idPersonal = signal<number>(0);


  listaPersonal = signal<personal[]>([]);
  cerrarModal() {
    this.encargadoService.cambiarEstadoModal();
  }

  obtenerIdPersonal(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.idPersonal.set(+value);
  }

  registrarEncargado(event: Event) {
    event.preventDefault();
    const encargado: EncargadoRegister = {
      nombre: this.nombre(),
      correoNotificacion: this.correoNotificacion(),
      idPersonal: this.idPersonal()
    };
    console.log(encargado);

    this.encargadoService.registrarEncargado(encargado).subscribe({
      next: (response: any) => {
        this.toastr.success('Registro exitoso');
        this.cerrarModal();
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail || e.error?.message || 'Error al registrar encargado';
        this.toastr.error(errorMessage, "Error", {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        });
      }
    });
  }

  ngOnInit() {
    this.personalService.listarPersonal().subscribe(
      (response: any) => {
        this.listaPersonal.set(response);
      }
    )
  }
}
