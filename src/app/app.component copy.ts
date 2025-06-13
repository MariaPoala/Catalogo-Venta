import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Producto, ProductoService } from './servicios/producto.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor, HttpClientModule, FooterComponent, NgIf, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'catalogo-productos';
  productos: Producto[] = [];
  empresa: string[] = [];
  categoriasGeneral: string[] = [];
  mostrarDropdown = false;
  categoriaSeleccionada: string | null = null;
  categoriaSeleccionadaGeneral: string | null = null;
  categoriaSeleccionadas: string | null = null;
  productoSeleccionado: string | null = null;
  filtroNombre: string = '';
  productosFiltrado: Producto[] = [];
  categoriasGlobales = ['Abarrotes', 'Pastelería', 'Higiene', 'Limpieza', 'Bebidas', 'Snacks'];
  descripcion: string | null = null;


  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe((data: Producto[]) => {
      this.productos = data;
      // const categorias = data.map((p) => p.CATEGORIA);

      const categoriageneral = data.map((p) => p.CATEGORIAGENERAL)
      this.categoriasGeneral = [...new Set(categoriageneral)];



      this.filtrarProductos(); // Aplica filtro inicial
    });
  }


  seleccionarYCerrarDropdown(categoria: string | null) {
    this.seleccionarCategoria(categoria);
    this.mostrarDropdown = false;
    this.filtrarProductos();
  }

  seleccionarCategoria(categoria: string | null) {
    this.categoriaSeleccionada = categoria;
    this.filtroNombre = '';
    this.filtrarProductos();

  }

  // seleccionarCategoriaGeneral(categoria: string | null) {
  //   this.categoriaSeleccionadaGeneral = categoria;
  //   console.log("selec " + this.categoriaSeleccionadaGeneral)
  //   this.filtroNombre = '';
  //   this.filtrarProductos();
  // }

  seleccionarCategoriaGeneral(categoria: string | null) {
    this.categoriaSeleccionadaGeneral = categoria;
    this.categoriaSeleccionadas = categoria;
    console.log("selec " + this.categoriaSeleccionadaGeneral);
    this.filtroNombre = '';
    const categorias = this.productos
      .filter((p) => p.CATEGORIAGENERAL === this.categoriaSeleccionadaGeneral)
      .map((p) => p.EMPRESA);
    this.empresa = [...new Set(categorias)];
    if (categoria == null) {
      const nulo = this.productos.map((p) => p.EMPRESA)
      this.empresa = [...new Set(this.productos.map((p) => p.EMPRESA))];
    }
    console.log("CAT " + this.categoriaSeleccionadaGeneral);

    this.filtrarProductos();
  }

  selectProducto(codigo: string | null) {
    console.log("codigo", codigo)
    this.productoSeleccionado = codigo;
   
    const prod = this.productos
      .filter((p) => p.CÓDIGO === codigo)
      .map((p) => p.DESCRIPCIÓN);
      //  this.descripcion = prod.
  }
  mostrarSidebar = false;
  mostrardetalle = false;


  private timeout: any;

  filtrarProductos(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let filtrados = this.productos;

      if (this.categoriaSeleccionada) {
        filtrados = filtrados.filter(p => p.EMPRESA === this.categoriaSeleccionada);
      }
      if (this.categoriaSeleccionadaGeneral) {
        filtrados = filtrados.filter(p => p.CATEGORIAGENERAL === this.categoriaSeleccionadaGeneral);
      }


      const filtro = this.filtroNombre.toLowerCase().trim();
      if (filtro) {
        filtrados = filtrados.filter((p) =>
          p.DESCRIPCIÓN.toLowerCase().includes(filtro)
        );
      }
      this.productosFiltrado = filtrados;
    }, 20);


  }
  // onImgError(event: Event) {
  //   (event.target as HTMLImageElement).src = '../images/sinimagen.jpg';
  // }
  onImgError(event: any) {
    const fallback = '../images/sinimagen.jpg';

    // Evita bucle infinito si la imagen de respaldo tampoco existe
    if (!event.target.src.includes(fallback)) {
      event.target.src = fallback;
    } else {
      event.target.style.display = 'none'; // oculta completamente si nada carga
    }
  }

}
