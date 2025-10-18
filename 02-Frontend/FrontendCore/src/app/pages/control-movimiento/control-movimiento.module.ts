import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlMovimientoRoutingModule } from './control-movimiento-routing.module';
import { ControlMovimientoComponent } from './control-movimiento.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ControlMovimientoComponent
  ],
  imports: [
    CommonModule,
    ControlMovimientoRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule
  ]
})
export class ControlMovimientoModule { }
