import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResumenSemanalRoutingModule } from './resumen-semanal-routing.module';
import { ResumenSemanalListComponent } from './resumen-semanal-list/resumen-semanal-list.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ResumenSemanalListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,                    // Para ngModel
    ResumenSemanalRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ResumenSemanalModule { }
