import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = environment.apiUrl + '/ventas';

  constructor(private http: HttpClient) {}

  crearVenta(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}