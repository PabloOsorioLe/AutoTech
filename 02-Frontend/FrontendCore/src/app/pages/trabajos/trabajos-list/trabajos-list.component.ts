import { Component } from '@angular/core';
import { Trabajo } from '../trabajos.model';

@Component({
  selector: 'app-trabajos-list',
  templateUrl: './trabajos-list.component.html'
})
export class TrabajosListComponent {
  trabajos: Trabajo[] = [
    { id: 1, titulo: 'aceite bassol 10w40', descripcion: 'Cambio de aceite', estado: 'Pendiente', fechaInicio: new Date() },
    { id: 2, titulo: 'filtro', descripcion: 'Cambio de filtro de aire', estado: 'Pendiente', fechaInicio: new Date() },
    { id: 3, titulo: 'Reparación puerta', descripcion: 'Reparar cerradura puerta', estado: 'En Progreso', fechaInicio: new Date() },
    { id: 4, titulo: 'Botón + receptor', descripcion: 'Reemplazo botón y receptor', estado: 'Pendiente', fechaInicio: new Date() },
    { id: 5, titulo: 'Ampolleta 1 contact', descripcion: 'Cambio de ampolleta', estado: 'Completado', fechaInicio: new Date() },
    { id: 6, titulo: 'Sunroof motor', descripcion: 'Reparación de sunroof', estado: 'Pendiente', fechaInicio: new Date() },
    { id: 7, titulo: 'Reparación vidrio', descripcion: 'Reparar vidrio ventana', estado: 'Pendiente', fechaInicio: new Date() },
    { id: 8, titulo: 'Reparación motor', descripcion: 'Ajuste y revisión de motor', estado: 'En Progreso', fechaInicio: new Date() },
    { id: 9, titulo: 'Servicio técnico', descripcion: 'Servicio técnico general', estado: 'Pendiente', fechaInicio: new Date() }
  ];

  // Métodos editar y eliminar para pruebas
  editar(id: number) {
    alert('Editar trabajo ID: ' + id);
  }

  eliminar(id: number) {
    this.trabajos = this.trabajos.filter(t => t.id !== id);
  }
}
