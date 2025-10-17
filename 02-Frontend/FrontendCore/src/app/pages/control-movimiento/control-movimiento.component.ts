import { Component } from '@angular/core';

interface Movimiento {
  trabajo: string;
  tecnico: string;
  debito: number;
  efectivo: number;
  transferencia: number;
}

@Component({
  selector: 'app-control-movimiento',
  templateUrl: './control-movimiento.component.html',
  styleUrls: ['./control-movimiento.component.css']
})
export class ControlMovimientoComponent {
  // Datos de prueba similares a la planilla
  movimientos: Movimiento[] = [
    { trabajo: 'aceite bassol 10w40', tecnico: 'pedro', debito: 80000, efectivo: 0, transferencia: 0 },
    { trabajo: 'filtro', tecnico: 'pedro', debito: 0, efectivo: 5000, transferencia: 0 },
    { trabajo: 'Reparación puerta', tecnico: 'yemdi', debito: 35000, efectivo: 0, transferencia: 0 },
    { trabajo: 'Botón + receptor', tecnico: 'yemdi', debito: 0, efectivo: 0, transferencia: 15000 },
    { trabajo: 'Ampolleta 1 contact', tecnico: 'yemdi', debito: 0, efectivo: 0, transferencia: 1000 },
    { trabajo: 'Sunroof motor', tecnico: 'jose', debito: 0, efectivo: 0, transferencia: 44000 },
    { trabajo: 'Reparación vidrio', tecnico: 'jose', debito: 0, efectivo: 0, transferencia: 0 },
    { trabajo: 'Reparación motor', tecnico: 'albert', debito: 0, efectivo: 0, transferencia: 0 },
    { trabajo: 'Servicio técnico', tecnico: 'albert', debito: 15000, efectivo: 0, transferencia: 0 }
  ];
  editing: { trabajo: string, tecnico: string, tipo: 'debito'|'efectivo'|'transferencia' } | null = null;

  // Guarda nuevo valor tras edición
setValor(trabajo: string, tecnico: string, tipo: 'debito'|'efectivo'|'transferencia', valor: number) {
  const mov = this.movimientos.find(
    m => m.trabajo === trabajo && m.tecnico === tecnico
  );
  if (mov) {
    mov[tipo] = valor;
  } else if (valor && valor > 0) {
    // Si no existe el registro, créalo (opcional según tu lógica)
    this.movimientos.push({
      trabajo, tecnico,
      debito: tipo === 'debito' ? valor : 0,
      efectivo: tipo === 'efectivo' ? valor : 0,
      transferencia: tipo === 'transferencia' ? valor : 0
    });
  }
  this.editing = null;
}

  // Trabajadores detectados dinámicamente
  get tecnicos(): string[] {
    return Array.from(new Set(this.movimientos.map(m => m.tecnico)));
  }

  // Trabajos únicos (filas)
  get trabajos(): string[] {
    return Array.from(new Set(this.movimientos.map(m => m.trabajo)));
  }

  // Busca el movimiento de un trabajo/trabajador
  getMovimiento(trabajo: string, tecnico: string): Movimiento | undefined {
    return this.movimientos.find(
      m => m.trabajo === trabajo && m.tecnico === tecnico
    );
  }

  // Suma subtotal columna/técnico (tipo: debito, efectivo, transferencia)
// Suma subtotal columna/técnico (tipo: debito, efectivo, transferencia)
getTotalPorTecnico(tecnico: string, tipo: keyof Movimiento): number {
  return this.movimientos
    .filter(m => m.tecnico === tecnico)
    .reduce((sum, m) => sum + Number(m[tipo] || 0), 0);
}

// Suma totales generales por tipo
getTotalGeneral(tipo: keyof Movimiento): number {
  return this.movimientos.reduce((sum, m) => sum + Number(m[tipo] || 0), 0);
}

}
