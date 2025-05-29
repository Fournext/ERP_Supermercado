import { Component, computed, inject, signal } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { TarjetaCarritoComponent } from "./components/tarjeta-carrito/tarjeta-carrito.component";
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DetalleCarritoService } from '../../../services/detalle-carrito.service';
import { ClienteService } from '../../../services/cliente.service';
import { PagoComponent } from "../pago/pago.component";
import { StripeService } from '../../../services/stripe.service';
import { DetalleCarrito } from '../../../interface/carrito';

@Component({
  selector: 'app-carrito',
  imports: [TarjetaCarritoComponent, RouterLink, PagoComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  private router = inject(Router);
  carritoService = inject(CarritoService);
  detalleCarritoService = inject(DetalleCarritoService);
  toastr = inject(ToastrService);
  clienteService = inject(ClienteService);
  private stripeService=inject(StripeService);


  private fecha: string = '';
  total = computed(() => this.carritoService.total());
  descuento=computed(()=>this.carritoService.descuento());

  estado: string = 'vigente';
  idCliente = computed(() => this.clienteService.clienteActual().idCliente);
  idCarrito = this.carritoService.carritoActual().idCarrito;

  estadoModal=computed(()=>this.stripeService.mostrarModal());

  mostrarModal(){
    this.stripeService.mostrarModalSwitch();
  }

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
    this.carritoService.registrarCarrito(this.total(), this.estado, this.fecha, this.idCliente() || 1).subscribe({
      next: (response: any) => {
        this.carritoService.carritoActual.set(response);
        this.carritoService.total.set(response.total);
        this.registrarDetalles(response.idCarrito);
        this.toastr.success("Registro exitoso");
        this.router.navigate(['/ecommerce/carrito']);
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
      if (detalle.cantidad != 0) {
        this.detalleCarritoService.registrarDetalleCarrito(detalle.cantidad, detalle.precio, detalle.subtotal, detalle.idProducto, idCarrito, detalle.url, detalle.descripcion);
      }
    })
  }

  obtenerTotal(detalle:DetalleCarrito[]) {
    let total: number = 0;
    detalle.map((detalle) => {
      total += detalle.subtotal;
    })
    this.carritoService.total.set(total);
  }

  ngOnInit() {
    this.fechaFormateado();
    //vaerifica la existencia de un carrito
    this.carritoService.existeCarritoActual(this.idCliente() || 0).subscribe(
      (subscribe: boolean) => {
        if (subscribe) {
          this.carritoService.obtenerCarrito(this.idCliente() || 1).subscribe({
            next: (response: any) => {
              this.carritoService.carritoActual.set(response);
              this.carritoService.total.set(response.total);
              this.detalleCarritoService.obtenerDetalleCarrito(response.idCarrito).subscribe((detalles) => {
                this.detalleCarritoService.listaDetalleCarritoActual.set(detalles);
                console.log(detalles);
                this.obtenerTotal(detalles); // 👈 aquí ya puedes calcular correctamente
              });
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
        } else {
          alert('Carrito Vacio');
        }
      }
    )




  }



}
