export interface Trabajo {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: 'Pendiente' | 'En Progreso' | 'Completado';
}
