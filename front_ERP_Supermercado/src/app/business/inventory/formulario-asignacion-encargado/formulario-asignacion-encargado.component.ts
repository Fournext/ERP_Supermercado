import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EncargadoService } from '../../../../services/encargado.service';
import { Encargado } from '../../../../interface/encargado.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formulario-asignacion-encargado',
  imports: [],
  templateUrl: './formulario-asignacion-encargado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioAsignacionEncargadoComponent {
  private encargadoService = inject(EncargadoService);
  private toastr = inject(ToastrService);

  idEncargado = signal<number>(0);

  listaEncargados = signal<Encargado[]>([]);


  obtenerEncargado(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.idEncargado.set(+value);
  }

  enviarNotificacion() {
    console.log(this.idEncargado());
    this.encargadoService.enviarNotificaciones(this.idEncargado()).subscribe(
      (response: any) => {
        this.toastr.success('Notificacion enviada');
      }
    )
  }

  cerrarModal(){
    this.encargadoService.cambiarEstadoModalEnviar();
  }

  ngOnInit() {
    this.encargadoService.listarEncargados().subscribe(
      (response: any) => {
        this.listaEncargados.set(response);
      }
    )
  }
}
