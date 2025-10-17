import { Component } from '@angular/core';

@Component({
  selector: 'app-mantenedor-tecnicos',
  templateUrl: './mantenedor-tecnicos.component.html',
  styleUrls: ['./mantenedor-tecnicos.component.css'],
})
export class MantenedorTecnicosComponent {
  tecnicos: string[] = ['Pedro', 'Yemdi', 'Jose'];
  nuevoTecnico: string = '';
  mensaje: string = '';

  agregarTecnico() {
    const nombre = this.nuevoTecnico.trim();
    if (!nombre) {
      this.mensaje = 'Ingrese un nombre válido.';
      return;
    }
    if (this.tecnicos.map(t => t.toLowerCase()).includes(nombre.toLowerCase())) {
      this.mensaje = 'El técnico ya existe.';
      return;
    }
    this.tecnicos.push(nombre);
    this.nuevoTecnico = '';
    this.mensaje = '';
  }

  eliminarTecnico(index: number) {
    this.tecnicos.splice(index, 1);
  }
}
