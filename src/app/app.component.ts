import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductoService, ProductoItem, DetalleProducto } from './servicios/producto.service';
import { ProductoTransformado } from './servicios/producto-transformado.model';
import { FooterComponent } from './footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NgFor,
    NgIf,
    FormsModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  productosTransformados: ProductoTransformado[] = [];
  categoriasGenerales: string[] = [];
  empresasFiltradas: string[] = [];
  filtroNombre: string = '';
  productosOriginal: ProductoItem[] = [];
  mostrarDropdown = false;
  categoriaSeleccionadas: string | null = null;
  empresaSeleccionada: string | null = null;
  mostrardetalle = false;
  mostrarSidebar = false;


  private productoService = inject(ProductoService);
  // Paginación
  paginaActual: number = 1;
  productosPorPagina: number = 30;

  get productosPaginados() {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosTransformados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosTransformados.length / this.productosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  productosOriginalTransformados: {
    imagen: string;
    productos: { nombre: string; precio: number }[];
    categoriaGeneral: string;
    categoria: string;
    empresa: string;
  }[] = [];
  seleccionarEmpresaYCerrar(empresa: string) {
    this.filtrarPorEmpresa(empresa);
    this.mostrarDropdown = false;
  }

  async ngOnInit(): Promise<void> {
    const data = await this.productoService.getProductos().toPromise();
    this.productosOriginal = data ?? [];

    // Solo transformamos 1 vez
    this.productosOriginalTransformados = await this.transformarProductos(this.productosOriginal);
    this.productosTransformados = [...this.productosOriginalTransformados]; // Copia inicial
    this.categoriasGenerales = this.extraerCategoriasGenerales(this.productosOriginal);
    // this.empresas = this.extraerEmpresas(this.productosOriginal);
    this.empresasFiltradas = [...new Set(this.productosOriginalTransformados.map(item => item.empresa))];

  }



  

async transformarProductos(data: ProductoItem[]): Promise<ProductoTransformado[]> {
  return data.map((item) => {
    const detalles = item.detail ?? [];
    const primerProd = detalles[0];
    const imagen = primerProd?.IMAGEN?.split('/').pop() ?? 'sinimagen.jpg';

    return {
      imagen,  // Solo el nombre del archivo
      productos: detalles.map(prod => ({
        nombre: prod.PRODUCTO,
        precio: prod.PRECIO
      })),
      categoriaGeneral: item.CATEGORIAGENERAL,
      categoria: item.CATEGORIA,
      empresa: item.EMPRESA?.trim() || 'SIN EMPRESA'
    };
  });
}






  extraerCategoriasGenerales(data: ProductoItem[]): string[] {
    const todas = data.map(item => item.CATEGORIAGENERAL);
    return [...new Set(todas)];
  }
  extraerEmpresas(data: ProductoItem[]): string[] {
    const empresas = data.map(item => item.EMPRESA?.trim() || 'SIN EMPRESA');
    return [...new Set(empresas)];
  }
  private filtroTimeout: any;

  filtrarProductos(): void {
    const filtro = this.filtroNombre.trim().toLowerCase();

    this.productosTransformados = this.productosOriginalTransformados.filter(item => {
      const coincideNombre = item.productos.some(prod =>
        prod.nombre.toLowerCase().includes(filtro)
      );

      const coincideCategoria = !this.categoriaSeleccionadas || item.categoriaGeneral === this.categoriaSeleccionadas;
      const coincideEmpresa = !this.empresaSeleccionada || item.empresa === this.empresaSeleccionada;

      return coincideNombre && coincideCategoria && coincideEmpresa;
    });
  }


  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionadas = categoria;
    this.empresaSeleccionada = null;
    this.filtroNombre = '';

    const empresasEnCategoria = this.productosOriginalTransformados
      .filter(p => categoria === 'TODAS' || p.categoriaGeneral === categoria)
      .map(p => p.empresa);

    this.empresasFiltradas = [...new Set(empresasEnCategoria)];
    this.filtrarProductos();
  }


  filtrarEmpresasPorCategoria() {
    if (!this.categoriaSeleccionadas) {
      this.empresasFiltradas = [...new Set(this.productosOriginalTransformados.map(item => item.empresa))];

    } else {
      this.empresasFiltradas = this.productosOriginalTransformados
        .filter(item => item.categoriaGeneral === this.categoriaSeleccionadas)
        .map(item => item.empresa)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  seleccionarCategoriaGeneral(categoria: string | null) {
    this.categoriaSeleccionadas = categoria;
    this.empresaSeleccionada = null;
    this.filtrarProductos();
    this.filtrarEmpresasPorCategoria();
    this.paginaActual = 1;
    this.mostrarDropdown = false;
  }


  filtrarPorEmpresa(empresa: string) {
    this.empresaSeleccionada = empresa === 'TODAS' ? null : empresa;
    this.filtrarProductos();
    this.mostrarDropdown = false;
    this.paginaActual = 1;
    
  }



  // filtrarPorCategoria(categoria: string): void {
  //   this.categoriaSeleccionada = categoria;
  //   this.filtrarProductos();
  // }


  onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/sinimagen.jpg';
}

}
