import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenedorTecnicosComponent } from './mantenedor-tecnicos.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: MantenedorTecnicosComponent }
];

@NgModule({
  declarations: [MantenedorTecnicosComponent],
  imports: [
    CommonModule,
    FormsModule,           // <-- Importa FormsModule aquí
    RouterModule.forChild(routes)
  ]
})
export class MantenedorTecnicosModule { }
