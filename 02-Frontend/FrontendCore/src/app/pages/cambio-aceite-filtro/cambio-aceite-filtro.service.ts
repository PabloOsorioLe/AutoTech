import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CambioAceiteFiltro } from '././cambio-aceite-filtro.model';

@Injectable({
  providedIn: 'root'
})
export class CambioAceiteFiltroService {
  private apiUrl = '/api/cambioaceitefiltro';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CambioAceiteFiltro[]> {
    return this.http.get<CambioAceiteFiltro[]>(this.apiUrl);
  }

  create(data: CambioAceiteFiltro): Observable<CambioAceiteFiltro> {
    return this.http.post<CambioAceiteFiltro>(this.apiUrl, data);
  }
}
