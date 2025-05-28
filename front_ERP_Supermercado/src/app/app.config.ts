import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',  // 👈 Establece abajo a la derecha
        timeOut: 3000,                        // 👈 3 segundoscl
        closeButton: true,                    // 👈 Botón de cerrar (x)
        progressBar: true,                    // 👈 Barra de progreso
        newestOnTop: true,                    // 👈 Nuevos arriba de viejos
        preventDuplicates: true               // 👈 Evita mensajes duplicados
      })
    ),
    provideNgxStripe('pk_test_51RSOXrQWBMQRJ0V0QIhFxflDri3YnipXCAA1isZewFKhPAhv8XYv8VfDoDTVrVtAfWYv93Tjr7TOcLuhuxDBkyuy00kh4grvEn')
  ]
};
