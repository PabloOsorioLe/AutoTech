import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

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
export class ControlMovimientoComponent implements AfterViewInit {

  @ViewChild('calendar') calendar!: MatDatepicker<Date>;
  @ViewChild('calendarButton') calendarButton!: ElementRef<HTMLButtonElement>;

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

  constructor(private dateAdapter: DateAdapter<Date>) {
    // Idioma español
    this.dateAdapter.setLocale('es-ES');

    // Cambiar los nombres de los días de la semana a L-M-M-J-V-S-D
    this.dateAdapter.getDayOfWeekNames = (style: 'long' | 'short' | 'narrow') => {
      return ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    };
  }

  ngAfterViewInit() {
    // Aquí podrías agregar lógica adicional si es necesario
  }

  setValor(trabajo: string, tecnico: string, tipo: 'debito' | 'efectivo' | 'transferencia', valor: number) {
    const mov = this.movimientos.find(m => m.trabajo === trabajo && m.tecnico === tecnico);
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

  get tecnicos(): string[] { return Array.from(new Set(this.movimientos.map(m => m.tecnico))); }
  get trabajos(): string[] { return Array.from(new Set(this.movimientos.map(m => m.trabajo))); }
  getMovimiento(trabajo: string, tecnico: string): Movimiento | undefined {
    return this.movimientos.find(m => m.trabajo === trabajo && m.tecnico === tecnico);
  }

  getTotalPorTecnico(tecnico: string, tipo: keyof Movimiento): number {
    return this.movimientos.filter(m => m.tecnico === tecnico)
      .reduce((sum, m) => sum + Number(m[tipo] || 0), 0);
  }

  getTotalNetoPorTecnico(tecnico: string) {
    return this.getTotalPorTecnico(tecnico, 'debito') +
           this.getTotalPorTecnico(tecnico, 'efectivo') +
           this.getTotalPorTecnico(tecnico, 'transferencia');
  }
  getTotalIVAPorTecnico(tecnico: string) { return this.getTotalNetoPorTecnico(tecnico) * 0.19; }
  getTotalConIVAPorTecnico(tecnico: string) { return this.getTotalNetoPorTecnico(tecnico) * 1.19; }

  getTotalNetoGeneral() { return this.movimientos.reduce((sum, m) => sum + m.debito + m.efectivo + m.transferencia, 0); }
  getTotalIVA() { return this.getTotalNetoGeneral() * 0.19; }
  getTotalConIVA() { return this.getTotalNetoGeneral() * 1.19; }

  selectedDate: Date = new Date();

  // Abrir el calendario alineado a la derecha y abajo del botón
  openCalendar() {
    this.calendar.open();
    setTimeout(() => {
      const panel = document.querySelector('.cdk-overlay-pane.mat-datepicker-popup') as HTMLElement;
      if (panel && this.calendarButton) {
        const rect = this.calendarButton.nativeElement.getBoundingClientRect();
        panel.style.top = `${rect.bottom + window.scrollY}px`;
        panel.style.left = `${rect.right - panel.offsetWidth}px`;
      }
    });
  }
}
