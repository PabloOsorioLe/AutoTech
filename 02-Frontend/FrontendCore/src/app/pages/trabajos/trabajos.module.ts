import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TrabajosRoutingModule } from './trabajos-routing.module';
import { TrabajosComponent } from './trabajos.component';
import { TrabajosListComponent } from './trabajos-list/trabajos-list.component';
import { TrabajosFormComponent } from './trabajos-form/trabajos-form.component';

@NgModule({
  declarations: [
    TrabajosComponent,
    TrabajosListComponent,
    TrabajosFormComponent
  ],
  imports: [
    CommonModule,
    TrabajosRoutingModule,
    ReactiveFormsModule  // <-- Importar aquí
  ]
})
export class TrabajosModule { }
