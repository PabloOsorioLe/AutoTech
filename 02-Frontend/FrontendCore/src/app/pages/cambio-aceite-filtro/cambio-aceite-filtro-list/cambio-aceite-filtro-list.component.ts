import { Component } from '@angular/core';

interface RegistroAceiteFiltro {
  trabajador: string;
  debito: number;
  efectivo: number;
  transferencia: number;
}

@Component({
  selector: 'app-cambio-aceite-filtro-list',
  templateUrl: './cambio-aceite-filtro-list.component.html',
  styleUrls: ['./cambio-aceite-filtro-list.component.css']
})
export class CambioAceiteFiltroListComponent {
  registros: RegistroAceiteFiltro[] = [
    { trabajador: 'Pedro', debito: 80000, efectivo: 0, transferencia: 0 },
    { trabajador: 'Juan', debito: 0, efectivo: 5000, transferencia: 0 },
    { trabajador: 'Diego', debito: 0, efectivo: 0, transferencia: 0 }
  ];

  editing: { trabajador: string, campo: keyof RegistroAceiteFiltro } | null = null;

  editar(registro: RegistroAceiteFiltro, campo: keyof RegistroAceiteFiltro) {
    this.editing = { trabajador: registro.trabajador, campo };
  }

getTotal(campo: keyof RegistroAceiteFiltro): number {
  return this.registros
    .map(r => Number(r[campo]) || 0) // convierte a número
    .reduce((a, b) => a + b, 0);
}

  getTotalNeto() {
    return this.getTotal('debito') + this.getTotal('efectivo') + this.getTotal('transferencia');
  }
  getTotalIVA() { return this.getTotalNeto() * 0.19; }
  getTotalConIVA() { return this.getTotalNeto() * 1.19; }
}
