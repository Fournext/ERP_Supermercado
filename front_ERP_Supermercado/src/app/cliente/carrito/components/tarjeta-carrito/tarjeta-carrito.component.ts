import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CarritoService } from '../../../../../services/carrito.service';
import { NgClass } from '@angular/common';
import { DetalleCarritoService } from '../../../../../services/detalle-carrito.service';

@Component({
  selector: 'tarjeta-carrito',
  imports: [NgClass],
  templateUrl: './tarjeta-carrito.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaCarritoComponent {
  private carritoService = inject(CarritoService);
  private detalleCarrito = inject(DetalleCarritoService);

  // Propiedades
  detalle = input<any>();
  descartado = signal<boolean>(false);

  // Subtotal redondeado con precisión
  subtotal = computed(() => {
    const s = this.detalle().precio * this.detalle().cantidad;
    return Math.round(s * 100) / 100;
  });

  aumentarCantidad() {
    if (this.detalle().cantidad === 0) return;
    this.detalle().cantidad++;
    this.actualizarItemEnLista();
  }

  disminuirCantidad() {
    if (this.detalle().cantidad === 0) return;
    this.detalle().cantidad--;
    this.actualizarItemEnLista();
  }

  descartarProducto() {
    this.detalle().cantidad = 0;
    this.actualizarItemEnLista();
    this.descartado.set(true);
  }

  private actualizarItemEnLista() {
    const lista = [...this.detalleCarrito.listaDetalleCarritoActual()];
    const index = lista.findIndex(p => p.idProducto === this.detalle().idProducto);
    if (index !== -1) {
      lista[index] = {
        ...lista[index],
        cantidad: this.detalle().cantidad,
        subtotal: this.subtotal()
      };
      this.detalleCarrito.listaDetalleCarritoActual.set(lista);
    }

    this.actualizarTotal();
  }

  private actualizarTotal() {
    const lista = this.detalleCarrito.listaDetalleCarritoActual();
    let total = 0;

    for (const producto of lista) {
      const subtotal = producto.cantidad * producto.precio;
      total += Math.round(subtotal * 100) / 100;
    }

    total = Math.round(total * 100) / 100;
    this.carritoService.total.set(total);
  }
}
