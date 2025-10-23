import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { CambioAceiteFiltroListComponent } from './cambio-aceite-filtro-list/cambio-aceite-filtro-list.component';
import { CambioAceiteFiltroRoutingModule } from './cambio-aceite-filtro-routing.module';

@NgModule({
  declarations: [
    CambioAceiteFiltroListComponent,
    // otros componentes
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CambioAceiteFiltroRoutingModule,
    // otros imports
  ]
})
export class CambioAceiteFiltroModule { }
