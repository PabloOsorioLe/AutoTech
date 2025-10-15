import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  categoriaID: number;
  nombreCategoria: string;
  userID?: number;
}

export interface Producto {
  id?: number;
  nombre: string;
  categoriaID: number;
  categoria?: Categoria;
  codigo: string;
  precio: number;
  stock: number;
  proveedor: string;
  ubicacion: string;
  fechaIngreso: string;
  descripcion?: string;
  imagenUrl?: string;
  estado: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl + '/productos';
  private apiCategoriasUrl = environment.apiUrl + '/categorias';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiCategoriasUrl);
  }

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  editarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
