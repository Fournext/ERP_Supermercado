import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
      HttpClientModule, 
      BrowserAnimationsModule,         
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',  // 👈 Establece abajo a la derecha
        timeOut: 3000,                        // 👈 3 segundos
        closeButton: true,                    // 👈 Botón de cerrar (x)
        progressBar: true,                    // 👈 Barra de progreso
        newestOnTop: true,                    // 👈 Nuevos arriba de viejos
        preventDuplicates: true               // 👈 Evita mensajes duplicados
      })
    )
  ]
};
