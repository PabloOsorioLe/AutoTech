import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

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

  constructor(private dateAdapter: DateAdapter<Date>) {
    // Establece idioma español y formato de semana L-M-M-J-V-S-D
    this.dateAdapter.setLocale('es-ES');
  }

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

  editing: { trabajo: string, tecnico: string, tipo: 'debito' | 'efectivo' | 'transferencia' } | null = null;

  // Guardar nuevo valor tras edición
  setValor(trabajo: string, tecnico: string, tipo: 'debito' | 'efectivo' | 'transferencia', valor: number) {
    const mov = this.movimientos.find(
      m => m.trabajo === trabajo && m.tecnico === tecnico
    );
    if (mov) {
      mov[tipo] = valor;
    } else if (valor && valor > 0) {
      this.movimientos.push({
        trabajo, tecnico,
        debito: tipo === 'debito' ? valor : 0,
        efectivo: tipo === 'efectivo' ? valor : 0,
        transferencia: tipo === 'transferencia' ? valor : 0
      });
    }
    this.editing = null;
  }

  // Técnicos únicos
  get tecnicos(): string[] {
    return Array.from(new Set(this.movimientos.map(m => m.tecnico)));
  }

  // Trabajos únicos
  get trabajos(): string[] {
    return Array.from(new Set(this.movimientos.map(m => m.trabajo)));
  }

  getMovimiento(trabajo: string, tecnico: string): Movimiento | undefined {
    return this.movimientos.find(m => m.trabajo === trabajo && m.tecnico === tecnico);
  }

  // Totales por técnico y tipo
  getTotalPorTecnico(tecnico: string, tipo: keyof Movimiento): number {
    return this.movimientos
      .filter(m => m.tecnico === tecnico)
      .reduce((sum, m) => sum + Number(m[tipo] || 0), 0);
  }

  // Totales generales
  getTotalGeneral(tipo: keyof Movimiento): number {
    return this.movimientos.reduce((sum, m) => sum + Number(m[tipo] || 0), 0);
  }

  // Totales con IVA
  getTotalNetoGeneral(): number {
    return this.movimientos.reduce(
      (sum, m) => sum + m.debito + m.efectivo + m.transferencia,
      0
    );
  }

  getTotalIVA(): number {
    return this.getTotalNetoGeneral() * 0.19;
  }

  getTotalConIVA(): number {
    return this.getTotalNetoGeneral() * 1.19;
  }

  getTotalPorTecnicoGeneral(tecnico: string): number {
    return (
      this.getTotalPorTecnico(tecnico, 'debito') +
      this.getTotalPorTecnico(tecnico, 'efectivo') +
      this.getTotalPorTecnico(tecnico, 'transferencia')
    );
  }

  getTotalNetoPorTecnico(tecnico: string): number {
    return this.getTotalPorTecnico(tecnico, 'debito') +
           this.getTotalPorTecnico(tecnico, 'efectivo') +
           this.getTotalPorTecnico(tecnico, 'transferencia');
  }

  getTotalIVAPorTecnico(tecnico: string): number {
    return this.getTotalNetoPorTecnico(tecnico) * 0.19;
  }

  getTotalConIVAPorTecnico(tecnico: string): number {
    return this.getTotalNetoPorTecnico(tecnico) * 1.19;
  }

  // 📅 Control del calendario
  selectedDate: Date = new Date();
  showCalendar: boolean = false;
  calendarPosition = { top: '0px', left: '0px' };

  toggleCalendar(event: MouseEvent) {
    const icon = event.currentTarget as HTMLElement;
    const rect = icon.getBoundingClientRect();

    // Posicionar debajo a la derecha
    this.calendarPosition = {
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.right - 250}px`
    };

    this.showCalendar = !this.showCalendar;
  }

  onDateChange(event: any) {
    const value = event.value;
    if (value) {
      this.selectedDate = new Date(value);
      // Aquí podrías refrescar datos según fecha
    }
    this.showCalendar = false;
  }
}
