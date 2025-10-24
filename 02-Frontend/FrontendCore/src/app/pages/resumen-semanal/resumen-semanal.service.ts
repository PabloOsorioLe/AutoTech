import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenSemanalDTO } from './resumen-semanal.model';

@Injectable({
  providedIn: 'root'
})
export class ResumenSemanalService {
  private apiUrl = '/api/reportes/ventas-semanal';

  constructor(private http: HttpClient) {}

  getResumen(fechaInicio: string, fechaFin: string): Observable<ResumenSemanalDTO[]> {
    return this.http.get<ResumenSemanalDTO[]>(`${this.apiUrl}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
