import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Esta interfaz es para cada producto dentro de 'detail'
export interface DetalleProducto {
  PRODUCTO: string;
  PRECIO: number;
  CÓDIGO: number;
  IMAGEN: string;
  'UNIDAD DE MEDIDA': string;
}

// Esta interfaz es para cada objeto general del JSON
export interface ProductoItem {
  descripcion_general: string;
  detail: DetalleProducto[];
  CATEGORIAGENERAL: string;
  CATEGORIA: string;
  EMPRESA: string; 
  STOCK: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private jsonUrl = 'assets/productos.json';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductoItem[]> {
    return this.http.get<ProductoItem[]>(this.jsonUrl);
  }
}
