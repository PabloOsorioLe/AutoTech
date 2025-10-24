// resumen-semanal.model.ts
export interface VentaDetalle {
  concepto: string;
  debito: number;
  efectivo: number;
  transferencia: number;
}

export interface ResumenSemanalDTO {
  trabajador: string;
  neto: number;
  iva: number;
  total: number;
  detalles: VentaDetalle[];
}
