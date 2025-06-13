import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../servicios/producto.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  imports: [NgFor, NgIf],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }
}
