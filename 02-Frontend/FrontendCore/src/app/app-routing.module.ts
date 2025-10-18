import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductosComponent } from './pages/productos/productos.component';
import { VentasComponent } from './pages/ventas/ventas.component'; // ✅ IMPORTAR NUEVO COMPONENTE
import { VentasDetallesComponent } from './pages/ventas-detalles/ventas-detalles.component'; // IMPORTAR NUEVO COMPONENTE

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  // RUTAS PROTEGIDAS
  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard], data: { animation: 'ProductosPage' } },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard], data: { animation: 'VentasPage' } }, 
  { path: 'venta/:id', component: VentasDetallesComponent, canActivate: [AuthGuard] },
  // LOGIN sigue sin guard
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'control-movimiento', loadChildren: () => import('./pages/control-movimiento/control-movimiento.module').then(m => m.ControlMovimientoModule) },
  { path: 'mantenedor-tecnicos', loadChildren: () => import('./pages/mantenedor-tecnicos/mantenedor-tecnicos.module').then(m => m.MantenedorTecnicosModule) },
  { path: 'trabajos', loadChildren: () => import('./pages/trabajos/trabajos.module').then(m => m.TrabajosModule) },
  { path: '**', redirectTo: '/productos' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
