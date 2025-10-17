import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantenedorTecnicosComponent } from './mantenedor-tecnicos.component';

const routes: Routes = [{ path: '', component: MantenedorTecnicosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenedorTecnicosRoutingModule { }
