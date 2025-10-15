import { Component, OnInit } from '@angular/core';
import { VentasDetallesService } from '../../services/ventas-detalles.service';

interface Pago {
  metodo: string;
  monto: number;
}

declare var bootstrap: any; // Para el modal de Bootstrap

@Component({
  selector: 'app-ventas-detalles',
  templateUrl: './ventas-detalles.component.html',
  styleUrls: ['./ventas-detalles.component.css']
})
export class VentasDetallesComponent implements OnInit {
  ventasDelDia: any[] = [];
  totalVentas: number = 0;
  pagosEfectivo: number = 0;
  pagosDebito: number = 0;
  pagosCredito: number = 0;
  otrosPagos: number = 0;

  ventaSeleccionada: any = null;

  constructor(private ventasService: VentasDetallesService) { }

  ngOnInit(): void {
    this.getVentasDelDia();
  }

  getVentasDelDia(): void {
    this.ventasService.getVentasDelDia().subscribe(
      (data) => {
        this.ventasDelDia = data;
        this.calculateTotales();
      },
      (error) => {
        console.error('Error al obtener las ventas del día:', error);
      }
    );
  }

  calculateTotales(): void {
    this.totalVentas = this.ventasDelDia.reduce((total, venta) => total + venta.total, 0);

    this.pagosEfectivo = 0;
    this.pagosDebito = 0;
    this.pagosCredito = 0;
    this.otrosPagos = 0;

    this.ventasDelDia.forEach(venta => {
      const pagos: Pago[] = venta.pagos || [];

      pagos.forEach((pago: Pago) => {
        if (pago && pago.metodo) {
          switch (pago.metodo.toLowerCase()) {
            case 'efectivo':
              this.pagosEfectivo += pago.monto;
              break;
            case 'debito':
              this.pagosDebito += pago.monto;
              break;
            case 'credito':
              this.pagosCredito += pago.monto;
              break;
            default:
              this.otrosPagos += pago.monto;
              break;
          }
        } else {
          this.otrosPagos += pago.monto || 0;
        }
      });
    });
  }

  // Método para abrir el modal con los detalles de la venta
ventaSeleccionadaId: number | null = null;

abrirModal(venta: any): void {
  this.ventaSeleccionada = venta;
  this.ventaSeleccionadaId = venta.id;
  setTimeout(() => {
    const modalElement = document.getElementById('detalleVentaModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }, 0);
}




}
