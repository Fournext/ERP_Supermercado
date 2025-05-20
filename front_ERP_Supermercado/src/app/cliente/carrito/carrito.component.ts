import { Component, computed, inject, signal } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { TarjetaCarritoComponent } from "./components/tarjeta-carrito/tarjeta-carrito.component";
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DetalleCarritoService } from '../../../services/detalle-carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [TarjetaCarritoComponent, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  private router = inject(Router);
  carritoService = inject(CarritoService);
  detalleCarritoService = inject(DetalleCarritoService);
  toastr = inject(ToastrService);


  //propiedades

  // listaProductoCarrito = computed(() => this.detalleCarritoService.listaDetalleCarritoActual().map((detalle) => {
  //   this.carritoService.total.set(this.carritoService.total() + (detalle.cantidad * detalle.precio));
  //   return detalle;
  // }));

  private fecha: string = '';
  total = computed(() => this.carritoService.total());
  estado: string = 'vigente';
  idCliente: number = 1;

  idCarrito = this.carritoService.carritoActual().idCarrito;

  fechaFormateado() {
    const value = new Date().toISOString().split('T')[0];;
    if (!value) return;

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses: 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const formateado = `${year}-${month}-${day}`;
    this.fecha = formateado;
  }

  volverHome() {
    this.router.navigate(['/ecommerce']);
  }

  registrarCarrito() {
    this.carritoService.registrarCarrito(this.total(), this.estado, this.fecha, this.idCliente).subscribe({
      next: (response: any) => {
        this.carritoService.carritoActual.set(response);
        this.carritoService.total.set(response.total);
        this.registrarDetalles(response.idCarrito);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El carrito fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar carrito: " + errorMessage, 'Error');
        }
      }
    })
  }

  registrarDetalles(idCarrito: number) {
    console.log(this.detalleCarritoService.listaDetalleCarritoActual());
    this.detalleCarritoService.listaDetalleCarritoActual().map((detalle) => {
      this.detalleCarritoService.registrarDetalleCarrito(detalle.cantidad, detalle.precio, detalle.subtotal, detalle.idProducto, idCarrito, detalle.url, detalle.descripcion);
    })
  }

  ngOnInit() {
    this.fechaFormateado();

    this.carritoService.obtenerCarrito(1).subscribe({
      next: (response: any) => {
        this.carritoService.carritoActual.set(response);
        this.carritoService.total.set(response.total);
        this.detalleCarritoService.obtenerDetalleCarrito(response.idCarrito);
        console.log(response);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El carrito fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar carrito: " + errorMessage, 'Error');
        }
      }
    })
  }



}
