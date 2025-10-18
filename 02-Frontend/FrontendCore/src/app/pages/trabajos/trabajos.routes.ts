import { Routes } from '@angular/router';
import { TrabajosListComponent } from './trabajos-list/trabajos-list.component';
import { TrabajosFormComponent } from './trabajos-form/trabajos-form.component';

export const TRABAJOS_ROUTES: Routes = [
  { path: '', component: TrabajosListComponent },
  { path: 'nuevo', component: TrabajosFormComponent },
  { path: 'editar/:id', component: TrabajosFormComponent }
];
