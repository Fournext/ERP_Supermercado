// src/app/services/stripe.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private http = inject(HttpClient);
  private stripePromise = loadStripe('pk_test_51RSOXrQWBMQRJ0V0QIhFxflDri3YnipXCAA1isZewFKhPAhv8XYv8VfDoDTVrVtAfWYv93Tjr7TOcLuhuxDBkyuy00kh4grvEn'); // Cambia por tu clave
  private apiUrl = environment.endpoint;
  private complementoUrl = 'stripe';

  mostrarModal = signal<boolean>(false);

  mostrarModalSwitch() {
    this.mostrarModal.set(!this.mostrarModal());
  }

  async inicializarElement(): Promise<{ stripe: Stripe, elements: StripeElements, card: StripeCardElement }> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe no cargó');

    const elements = stripe.elements();
    const card = elements.create('card',{
      hidePostalCode: true
    });
    return { stripe, elements, card };
  }

  crearPaymentIntent(monto: number, currency: string = 'usd') {
    const montoCentavos = monto * 100;

    if (currency === 'usd' && montoCentavos < 50) {
      return Promise.reject(new Error('El monto mínimo permitido es $0.50 USD.'));
    }

    return this.http.post<any>(`${this.apiUrl}${this.complementoUrl}/paymentintent`, {
      amount: montoCentavos,
      currency,
    }).toPromise();
  }

  async confirmarPago(stripe: Stripe, clientSecret: string, card: StripeCardElement) {
    return await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });
  }
}
