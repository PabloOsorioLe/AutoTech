import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ResumenSemanalService } from '../resumen-semanal.service';
import { ResumenSemanalDTO } from '../resumen-semanal.model';

export interface ResumenTecnicoSemanaDTO {
  trabajador: string;
  totalDebito: number;
  totalEfectivo: number;
  totalTransferencia: number;
  neto: number;
  iva: number;
  total: number;
}

@Component({
  selector: 'app-resumen-semanal-list',
  templateUrl: './resumen-semanal-list.component.html',
  styleUrls: ['./resumen-semanal-list.component.css']
})
export class ResumenSemanalListComponent implements OnInit {
  resumen: ResumenTecnicoSemanaDTO[] = [];

  selectedDate: Date = new Date();
  semanaInicio: Date = new Date();
  semanaFin: Date = new Date();

  @ViewChild('calendar') calendar!: MatDatepicker<Date>;

  constructor(private resumenService: ResumenSemanalService) {}

  ngOnInit() {
    this.recalcularSemana(this.selectedDate);
    this.cargarDatosSemana();
  }

  openCalendar() {
    this.calendar.open();
  }

  onDateChange(date: Date | null) {
    if (date) {
      this.selectedDate = date;
      this.recalcularSemana(date);
      this.cargarDatosSemana();
    }
  }

  recalcularSemana(baseDate: Date) {
    const day = baseDate.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    this.semanaInicio = new Date(baseDate);
    this.semanaInicio.setDate(baseDate.getDate() + diffToMonday);
    this.semanaFin = new Date(this.semanaInicio);
    this.semanaFin.setDate(this.semanaInicio.getDate() + 5);
  }

  cargarDatosSemana() {
    // Aquí puedes reemplazar por llamada a servicio real, se deja acá como ejemplo mock
    this.resumen = [
      {
        trabajador: 'Pedro',
        totalDebito: 80000,
        totalEfectivo: 5000,
        totalTransferencia: 0,
        neto: 85000,
        iva: 15200,
        total: 100200
      },
      {
        trabajador: 'Yemdi',
        totalDebito: 35000,
        totalEfectivo: 0,
        totalTransferencia: 16000,
        neto: 51000,
        iva: 9690,
        total: 60690
      },
      {
        trabajador: 'Jose',
        totalDebito: 0,
        totalEfectivo: 0,
        totalTransferencia: 44000,
        neto: 44000,
        iva: 8360,
        total: 52360
      },
      {
        trabajador: 'Albert',
        totalDebito: 15000,
        totalEfectivo: 0,
        totalTransferencia: 0,
        neto: 15000,
        iva: 2850,
        total: 17850
      }
    ];

    // Para ejemplo con servicio real, descomenta y actualiza para usar el endpoint
    /*
    this.resumenService.getResumen(this.formatDate(this.semanaInicio), this.formatDate(this.semanaFin))
      .subscribe((data: ResumenSemanalDTO[]) => {
        this.resumen = data.map(item => {
          const totalDebito = item.detalles?.reduce((sum, d) => sum + (d.debito || 0), 0) || 0;
          const totalEfectivo = item.detalles?.reduce((sum, d) => sum + (d.efectivo || 0), 0) || 0;
          const totalTransferencia = item.detalles?.reduce((sum, d) => sum + (d.transferencia || 0), 0) || 0;
          return {
            trabajador: item.trabajador,
            totalDebito,
            totalEfectivo,
            totalTransferencia,
            neto: item.neto,
            iva: item.iva,
            total: item.total
          };
        });
      });
    */
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  dateClass = (d: Date) => {
  if (!this.semanaInicio || !this.semanaFin) return;
  return d >= this.semanaInicio && d <= this.semanaFin ? 'selected-week' : '';
};
}

