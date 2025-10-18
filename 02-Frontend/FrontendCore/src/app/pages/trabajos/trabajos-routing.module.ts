import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TRABAJOS_ROUTES } from './trabajos.routes';

@NgModule({
  imports: [RouterModule.forChild(TRABAJOS_ROUTES)],
  exports: [RouterModule]
})
export class TrabajosRoutingModule {}
