import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentasDetallesService {
  private apiUrl = environment.apiUrl + '/ventas'; // URL base de la API

  constructor(private http: HttpClient) { }

  // Método para obtener todas las ventas del día
  getVentasDelDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/del-dia`);  // Llamada al endpoint del día
  }
}
