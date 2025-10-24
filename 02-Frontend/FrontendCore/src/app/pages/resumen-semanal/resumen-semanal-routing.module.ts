import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumenSemanalListComponent } from './resumen-semanal-list/resumen-semanal-list.component';

const routes: Routes = [
  { path: '', component: ResumenSemanalListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenSemanalRoutingModule { }
