import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlMovimientoComponent } from './control-movimiento.component';

const routes: Routes = [{ path: '', component: ControlMovimientoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlMovimientoRoutingModule { }
