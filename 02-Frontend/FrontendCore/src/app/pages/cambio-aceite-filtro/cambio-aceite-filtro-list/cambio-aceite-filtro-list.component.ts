import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

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
export class CambioAceiteFiltroListComponent implements AfterViewInit {

  @ViewChild('calendar') calendar!: MatDatepicker<Date>;
  @ViewChild('calendarButton') calendarButton!: ElementRef<HTMLButtonElement>;

  registros: RegistroAceiteFiltro[] = [
    { trabajador: 'Pedro', debito: 80000, efectivo: 0, transferencia: 0 },
    { trabajador: 'Juan', debito: 0, efectivo: 5000, transferencia: 0 },
    { trabajador: 'Diego', debito: 0, efectivo: 0, transferencia: 0 }
  ];

  selectedDate: Date = new Date();

  editing: { trabajador: string, campo: keyof RegistroAceiteFiltro } | null = null;

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES');
    this.dateAdapter.getDayOfWeekNames = (style: 'long' | 'short' | 'narrow') => {
      return ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    };
  }

  ngAfterViewInit() {}

  editar(registro: RegistroAceiteFiltro, campo: keyof RegistroAceiteFiltro) {
    this.editing = { trabajador: registro.trabajador, campo };
  }

  getTotal(campo: keyof RegistroAceiteFiltro): number {
    return this.registros
      .map(r => Number(r[campo]) || 0)
      .reduce((a, b) => a + b, 0);
  }

  getTotalNeto() {
    return this.getTotal('debito') + this.getTotal('efectivo') + this.getTotal('transferencia');
  }

  getTotalIVA() {
    const baseIVA = this.getTotal('debito') + this.getTotal('transferencia');
    return baseIVA * 0.19;
  }

  getTotalConIVA() {
    const neto = this.getTotalNeto();
    const baseIVA = this.getTotal('debito') + this.getTotal('transferencia');
    return neto + baseIVA * 0.19;
  }
openCalendar() {
  this.calendar.open();
  setTimeout(() => {
    const panel = document.querySelector('.cdk-overlay-pane.mat-datepicker-popup') as HTMLElement;
    if (panel) {
      // POSICIÓN absoluta respecto a la ventana
      panel.style.position = 'fixed';

      // 30px desde abajo, 30px desde la derecha, igual que el .calendar-widget (FAB)
      panel.style.left = 'auto';
      panel.style.right = '-104px';  // Iguala con el CSS
      panel.style.top = 'auto';
      panel.style.bottom = '84px'; // Ajusta según alto del FAB y separación deseada

      panel.style.transform = 'none';
      panel.style.zIndex = '3000';

      // TAMAÑO personalizado
      panel.style.width = '440px';
      panel.style.minWidth = '420px';
      panel.style.maxWidth = '470px';
      panel.style.height = '485px';
      panel.style.minHeight = '370px';
      panel.style.maxHeight = '610px';
    }
  }, 50);
}





}
