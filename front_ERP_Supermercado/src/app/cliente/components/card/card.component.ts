import { Component, computed, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { ProductoConPrecio } from '../../../../interface/producto.interface';
import { ProductoService } from '../../../../services/producto.service';
import { ImagenService } from '../../../../services/imagen.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit, OnChanges {

  private productoService = inject(ProductoService);
  private imagenService = inject(ImagenService);

  public productos = computed(() => this.productoService.listaProductos());
  public imagenes = computed(() => this.imagenService.listaImagenes());
  public listaProductos = computed(() => this.productoService.listaProductos());
  public listaImagenes = computed(() => this.imagenService.listaImagenes());

  public filtroNombre = signal<string>('');
  public filtroCategoria = signal<string>('');
  public filtroCodigo = signal<string>('');

  ngOnInit() {
    this.productoService.obtenerProductos();
    this.imagenService.obtenerTodasLasImagenes();
  }

  // En el componente TypeScript
  public listaProductosConImagen = computed(() => {
    return this.productoService.listaProductos().map(producto => {
      const imagen = this.imagenes().find((imagenActual) => imagenActual.idProducto == producto.idProducto);
      return {
        ...producto,
        imagenUrl: imagen ? imagen.url : ''
      };
    });
  });

  public productosFiltrados = computed(() => {
    return this.listaProductos().filter((producto: ProductoConPrecio) =>
      producto.codigo.toLowerCase().includes(this.filtroCodigo().toLowerCase()) &&
      producto.descripcion.toLowerCase().includes(this.filtroNombre().toLowerCase()) &&
      producto.categoria.toLowerCase().includes(this.filtroCategoria().toLowerCase())
    ).map(producto => ({
      ...producto,
      imagenUrl: this.buscarUrl(producto.idProducto) || 'assets/default-image.jpg'
    }));
  });

  private buscarUrl(idProducto: number): string {
    const imagen = this.listaImagenes().find(imagenActual => imagenActual.idProducto === idProducto);
    return imagen ? imagen.url : 'assets/default-image.jpg';
  }

  @Input() categoriaFiltro?: string;

  ngOnChanges() {
    if (this.borrarFiltro) {
      this.filtroCodigo.set('');
      this.filtroNombre.set('');
      this.filtroCategoria.set('');
    } else {
      if (this.categoriaFiltro) {
        this.filtroCategoria.set(this.categoriaFiltro.toString());
      }
    }

  }

  @Input() borrarFiltro: boolean = false;
}
