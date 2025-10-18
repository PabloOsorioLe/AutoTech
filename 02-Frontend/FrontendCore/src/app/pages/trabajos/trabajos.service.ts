import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajo } from '././trabajos.model';

@Injectable({ providedIn: 'root' })
export class TrabajosService {
  private apiUrl = '/api/trabajos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Trabajo> {
    return this.http.get<Trabajo>(`${this.apiUrl}/${id}`);
  }

  create(trabajo: Trabajo): Observable<Trabajo> {
    return this.http.post<Trabajo>(this.apiUrl, trabajo);
  }

  update(trabajo: Trabajo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${trabajo.id}`, trabajo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
