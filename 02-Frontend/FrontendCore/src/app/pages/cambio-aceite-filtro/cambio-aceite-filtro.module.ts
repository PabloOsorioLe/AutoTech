import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Agrega esta línea
import { CambioAceiteFiltroListComponent } from './cambio-aceite-filtro-list/cambio-aceite-filtro-list.component';
import { CambioAceiteFiltroRoutingModule } from './cambio-aceite-filtro-routing.module';

@NgModule({
  declarations: [
    CambioAceiteFiltroListComponent,
    // otros componentes
  ],
  imports: [
    CommonModule,
    FormsModule, // <--- Incluye FormsModule aquí
    CambioAceiteFiltroRoutingModule,
    // otros imports
  ]
})
export class CambioAceiteFiltroModule { }
