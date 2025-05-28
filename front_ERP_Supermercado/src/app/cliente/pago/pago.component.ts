import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'; // 👈 agrega OnInit
import { StripeService } from '../../../services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { CarritoService } from '../../../services/carrito.service';
import { ToastrService } from 'ngx-toastr';
import { FacturaE } from '../../../interface/factura.interface';
import { FacturaService } from '../../../services/factura.service';

@Component({
  selector: 'app-pago',
  imports: [NgIf],
  templateUrl: './pago.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagoComponent implements OnInit { // 👈 implementa OnInit
  mensaje: string = '';
  total = computed(() => this.carritoService.total());

  private stripeService = inject(StripeService);
  private carritoService = inject(CarritoService);
  private facturaService = inject(FacturaService);
  private toastr = inject(ToastrService);
  private stripe: any;
  private card: StripeCardElement | null = null;
  cardListo = signal<boolean>(false);
  cargando = signal<boolean>(false);

  ocultarModal() {
    this.stripeService.mostrarModalSwitch();
  }

  async ngOnInit() {
    const { stripe, card } = await this.stripeService.inicializarElement();
    this.stripe = stripe;
    this.card = card;
    card.mount('#card-element');
    this.cardListo.set(true);// ✅ activar el botón después de montar
  }


  async pagar() {
    if (this.cargando() || !this.card || !this.stripe) return;

    this.cargando.set(true);
    this.mensaje = '';

    try {
      const intent = await this.stripeService.crearPaymentIntent(this.total());
      const result = await this.stripeService.confirmarPago(this.stripe, intent.client_secret, this.card);

      if (result.error) {
        this.mensaje = '❌ Error: ' + result.error.message;
      } else if (result.paymentIntent.status === 'succeeded') {
        this.mensaje = '✅ ¡Pago exitoso!';
        this.registrarFactura();
        this.stripeService.mostrarModalSwitch();
        this.toastr.success("Pago realizado exitosamente");
        // opcional: cerrar modal
      }
    } catch (err: any) {
      this.mensaje = '❌ Error inesperado: ' + err.message;
    } finally {
      this.cargando.set(false);
    }
  }

  //vamos a crear una factura

  fechaFormateado() {
    const value = new Date().toISOString().split('T')[0];;
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses: 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const formateado = `${year}-${month}-${day}`;
    return formateado;
  }

  fechaFormateadoFutura() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 5); // ✅ suma 5 días

    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0'); // meses: 0-11
    const day = String(hoy.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  registrarFactura() {
    const factura: FacturaE = {
      fecha: this.fechaFormateado(),
      fechaVencimiento: this.fechaFormateadoFutura(),
      total: this.total(),
      idCarrito: this.carritoService.carritoActual().idCarrito,
      idMetodoPago: 1,
      idCliente: this.carritoService.carritoActual().idCliente
    }
    this.facturaService.registrarFactura(factura);
  }





}
