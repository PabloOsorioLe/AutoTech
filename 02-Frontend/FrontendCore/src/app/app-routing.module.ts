import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'control-movimiento', loadChildren: () => import('./pages/control-movimiento/control-movimiento.module').then(m => m.ControlMovimientoModule) },
  { path: 'mantenedor-tecnicos', loadChildren: () => import('./pages/mantenedor-tecnicos/mantenedor-tecnicos.module').then(m => m.MantenedorTecnicosModule) },
  { path: 'trabajos', loadChildren: () => import('./pages/trabajos/trabajos.module').then(m => m.TrabajosModule) },
  // 👇 añade esta línea
  { path: 'cambio-aceite-filtro', loadChildren: () => import('./pages/cambio-aceite-filtro/cambio-aceite-filtro.module').then(m => m.CambioAceiteFiltroModule), canActivate: [AuthGuard] },
   { path: 'resumen-semanal', loadChildren: () => import('./pages/resumen-semanal/resumen-semanal.module').then(m => m.ResumenSemanalModule) },
  { path: '**', redirectTo: '/auth/login' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
