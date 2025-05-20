import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BoletaEntradaService } from '../../../../services/boleta-entrada.service';
import { DetalleBoletaEntradaService } from '../../../../services/detalle-boleta-entrada.service';
import { LoteService } from '../../../../services/lote.service';
import { PersonalService } from '../../../../services/personal.service';
import { personal } from '../../../../interface/personal';

@Component({
  selector: 'boleta-entrada-completa',
  imports: [],
  templateUrl: './boleta-entrada-completa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoletaEntradaCompletaComponent {
  private personalService = inject(PersonalService);
  boletaEntradaService = inject(BoletaEntradaService);//de aqui vamos a obtener la boleta actual
  detalleBoletaEntrada = inject(DetalleBoletaEntradaService);//de aqui vamos a obtener los detalles actuales

  listaEmpleados = signal<personal[]>([]);
  buscarPersonal(id: number) {
    const personal = this.listaEmpleados().find((personal: personal) => personal.id_personal == id);
    return `${personal?.nombre} ${personal?.apellido}`
  }

  ngOnInit() {
    this.personalService.listarPersonal().subscribe(
      (response) => {
        const listaPersonal = response.map((personalActual) => {
          const personalActual2: personal = {
            id_personal: personalActual.id_personal,
            nombre: personalActual.nombre,
            apellido: personalActual.apellido,
            carnet: personalActual.carnet,
            fecha_creacion: personalActual.fecha_creacion,
            idRol: personalActual.idRol,
            idTurno: personalActual.idTurno,
            idUsuario: personalActual.idUsuario
          }
          return personalActual2;
        }
        );
        this.listaEmpleados.set(listaPersonal);
      }
    )
  }


}
