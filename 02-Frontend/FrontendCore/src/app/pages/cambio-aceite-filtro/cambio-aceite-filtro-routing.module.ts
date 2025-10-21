import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambioAceiteFiltroListComponent } from './cambio-aceite-filtro-list/cambio-aceite-filtro-list.component';

const routes: Routes = [
  { path: '', component: CambioAceiteFiltroListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioAceiteFiltroRoutingModule {}
