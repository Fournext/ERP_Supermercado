import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ComprasService } from '../../../services/compras.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { MetodoPagoService } from '../../../services/metodoPago.service';

@Component({
  selector: 'boleta-compra-ver',
  imports: [],
  templateUrl: './boletaCompra.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BoletaCompraComponent {

  private boletaCompraService=inject(ComprasService);
  private proveedorService=inject(ProveedorService);
  private metodoService=inject(MetodoPagoService);

  boletaCompra=computed(()=>this.boletaCompraService.boletaCompraActual());
  listaDetalles=computed(()=>this.boletaCompraService.listaDetalleActual());
  listaProveedores=computed(()=>this.proveedorService.listaProveedor());
  listaMetodoPago=computed(()=>this.metodoService.listaMetodoPago());

  buscarProveedor(id: number) {
    const proveedor = this.listaProveedores().find((proveedor) => proveedor.idProveedor == id);
    return proveedor?.nombre;
  }
  buscarMetodo(id: number) {
    const metodo = this.listaMetodoPago().find((metodo) => metodo.metodoPagoId == id);
    return metodo?.nombre;
  }

  cerrarBoletaCompra(){
    this.boletaCompraService.verBoletaSwitch();
  }
}
