import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Esta interfaz es para cada producto dentro de 'detail'
export interface ProductoItem {
  CÓDIGO: string;
  IMAGEN: string | null;
  DESCRIPCIÓN: string;
  CATEGORIAGENERAL: string;
  CATEGORIA: string;
  EMPRESA: string | null;
  DETALLE: any;
  STOCK: number | null;
}


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private jsonUrl = 'assets/data/productos.json';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductoItem[]> {
    return this.http.get<ProductoItem[]>(this.jsonUrl);
  }
}
