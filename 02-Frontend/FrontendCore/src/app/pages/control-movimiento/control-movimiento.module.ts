import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlMovimientoRoutingModule } from './control-movimiento-routing.module';
import { ControlMovimientoComponent } from './control-movimiento.component';


@NgModule({
  declarations: [
    ControlMovimientoComponent
  ],
  imports: [
    CommonModule,
    ControlMovimientoRoutingModule
  ]
})
export class ControlMovimientoModule { }
