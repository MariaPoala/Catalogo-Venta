export interface ProductoTransformado {
  imagen: string;
  productos: {
    nombre: string;
    precio: number;
  }[];
  categoriaGeneral: string;
  categoria: string;
  empresa: string;
}
