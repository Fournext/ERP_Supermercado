import { Component, computed, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { ProductoConPrecio } from '../../../../interface/producto.interface';
import { ProductoService } from '../../../../services/producto.service';
import { ImagenService } from '../../../../services/imagen.service';
import { CarritoService } from '../../../../services/carrito.service';
import { DetalleCarritoService } from '../../../../services/detalle-carrito.service';
import { DetalleCarrito } from '../../../../interface/carrito';

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
  private carritoService = inject(CarritoService);
  private detalleCarrito = inject(DetalleCarritoService);

  public productos = computed(() => this.productoService.listaProductos());
  public imagenes = computed(() => this.imagenService.listaImagenes());
  public listaProductos = computed(() => this.productoService.listaProductos());
  public listaImagenes = computed(() => this.imagenService.listaImagenes());

  public filtroNombre = signal<string>('');
  public filtroCategoria = signal<string>('');
  public filtroCodigo = signal<string>('');



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

  public agregarCarrito(producto: ProductoConPrecio, url: string) {
    const detalleC: DetalleCarrito = {
      cantidad: 1,
      precio: producto.precio,
      subtotal: producto.precio,
      idProducto: producto.idProducto,
      url: url,
      descripcion: producto.descripcion
    }
    this.carritoService.total.set( this.carritoService.total()+producto.precio);
    this.detalleCarrito.listaDetalleCarritoActual.update((currentArray) => [...currentArray,detalleC]);
  }


  ngOnInit() {
    this.productoService.obtenerProductos();
    this.imagenService.obtenerTodasLasImagenes();
  }
  @Input() borrarFiltro: boolean = false;
}
