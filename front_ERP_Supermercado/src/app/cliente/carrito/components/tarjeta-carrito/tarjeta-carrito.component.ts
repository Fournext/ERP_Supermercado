import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ProductoConPrecio } from '../../../../../interface/producto.interface';
import { CarritoService } from '../../../../../services/carrito.service';

@Component({
  selector: 'tarjeta-carrito',
  imports: [],
  templateUrl: './tarjeta-carrito.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaCarritoComponent {
  private carritoService = inject(CarritoService);

  //propiedades
  detalle = input<any>();
  subtotal = computed(() => this.detalle().precio * this.detalle().cantidad);

  aumentarCantidad() {
    if (this.detalle().cantidad == 0) return;
    this.detalle().cantidad++;
    this.detalle().subtotal=this.detalle().precio * this.detalle().cantidad;
    this.carritoService.total.set(this.carritoService.total() + (this.detalle().precio));
  }

  disminuirCantidad() {
    if (this.detalle().cantidad == 0) return;
    this.detalle().cantidad--;
    this.detalle().subtotal=this.detalle().precio * this.detalle().cantidad;
    this.carritoService.total.set(this.carritoService.total() - (this.detalle().precio));
  }
}
