import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DetalleBoletaEntradaEnviar } from '../../../../interface/boletaEntrada.interface';
import { LoteService } from '../../../../services/lote.service';
import { Lote } from '../../../../interface/lote';
import { BoletaEntradaService } from '../../../../services/boleta-entrada.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'detalle-item',
  imports: [],
  templateUrl: './detalle-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleItemComponent {
  private loteService = inject(LoteService);
  private boletaEntradaService = inject(BoletaEntradaService);
  private toastr = inject(ToastrService);


  listaLotes = computed(() => this.loteService.listaLotes());
  detalle = input.required<DetalleBoletaEntradaEnviar>();

  cantidadAceptada = signal<number>(0);
  idLote = signal<number>(0);


  asignarLote(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idLote.set(+valor);
  }

  editarDetalleBoletaEntrada() {
    if(this.idLote()==0){
      alert("Es necesario asignar un lote!");
      return;
    }
    if (this.cantidadAceptada() >= 0 && this.cantidadAceptada() <= this.detalle().cantidadComprada) {
      const detalle = this.detalle();
      detalle.cantidad = this.cantidadAceptada();
      detalle.idLote = this.idLote();
      this.toastr.info("Cantidad actualizada");
      console.log(this.boletaEntradaService.listaDetalleActual());
    } else {
      this.toastr.error("Cantidad no valida!");
    }
  }


  ngOnInit() {

  }
}
