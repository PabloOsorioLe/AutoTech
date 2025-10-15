import { NgModule, isDevMode,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
registerLocaleData(localeEsCL);

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Componentes principales
import { ProductosComponent } from './pages/productos/productos.component';

// Componentes reutilizables
import { NavbarComponent } from './components/navbar/navbar.component';

// ✅ FALTABA IMPORTAR LOGIN COMPONENT
import { LoginComponent } from './auth/login/login.component'; // ajusta si está en otra ruta

// Módulo de autenticación
import { AuthModule } from './auth/auth.module';

// Angular Material
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

// Flatpickr
import { FlatpickrModule } from 'angularx-flatpickr';

// PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { VentasComponent } from './pages/ventas/ventas.component';
import { VentasDetallesComponent } from './pages/ventas-detalles/ventas-detalles.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductosComponent,
    VentasComponent,
    VentasDetallesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    // Angular Material
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,

    // Flatpickr
    FlatpickrModule.forRoot(),

    // PWA
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
      { provide: LOCALE_ID, useValue: 'es-CL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
