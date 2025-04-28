import { Component, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductoService } from '../../../services/producto.service';
import { ImagenService } from '../../../services/imagen.service';
import { MarcaService } from '../../../services/marca.service';
import { CategoriaService } from '../../../services/categoria.service';
import { ProductoConPrecio } from '../../../interface/producto.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export default class ProductsComponent {
  private productoService = inject(ProductoService);
  private imagenService = inject(ImagenService);
  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);
  private toastr = inject(ToastrService);

  public listaProductos = computed(() => this.productoService.listaProductos());
  public listaImagenes = computed(() => this.imagenService.listaImagenes());
  public listaMarcas = computed(() => this.marcaService.listaMarcas());
  public listaCategorias = computed(() => this.categoriaService.listaCategorias());

  public switchFormularioCrear = signal<boolean>(false);
  public switchFormularioActualizar = signal<boolean>(false);

  public filtroNombre = signal<string>('');
  public filtroCategoria = signal<string>('');
  public filtroCodigo = signal<string>('');

  // Filtrar productos dinámicamente según los valores ingresados
  public productosFiltrados = computed(() => {
    return this.listaProductos().filter(producto =>
      producto.codigo.toLowerCase().includes(this.filtroCodigo().toLowerCase()) &&
      producto.descripcion.toLowerCase().includes(this.filtroNombre().toLowerCase()) &&
      producto.categoria.toLowerCase().includes(this.filtroCategoria().toLowerCase())
    ).map(producto => ({
      ...producto,
      imagenUrl: this.buscarUrl(producto.idProducto) || 'assets/default-image.jpg'
    }));
  });

public trackProductos(index: number, producto: any): number {
    return producto.idProducto;
  }


  // En el componente TypeScript
  public listaProductosConImagen = computed(() => {
    return this.productoService.listaProductos().map(producto => {
      const imagen = this.listaImagenes().find((imagenActual) => imagenActual.idProducto == producto.idProducto);
      return {
        ...producto,
        imagenUrl: imagen ? imagen.url : ''
      };
    });
  });


  //atributos para crear
  public codigo = signal<string>('');
  public descripcion = signal<string>('');
  public marca = signal<string>('');
  public categoria = signal<string>('');
  public tipoProducto = signal<string>('');
  public precio = signal<string>('');


  //atributos para actualizar
  public id_producto = signal<string>('');
  public codigoA = signal<string>('');
  public descripcionA = signal<string>('');
  public marcaA = signal<string>('');
  public categoriaA = signal<string>('');
  public tipoProductoA = signal<string>('');
  public precioA = signal<string>('');

  //funcion que carga los datos desde el html
  public cargarDatos(producto: ProductoConPrecio) {
    console.log(producto);
    this.id_producto.set(producto.idProducto.toString());
    this.codigoA.set(producto.codigo);
    this.descripcionA.set(producto.descripcion);
    this.marcaA.set(producto.marca);
    this.categoriaA.set(producto.categoria);
    if (producto.tipo_producto == 'Perecedero') {
      this.tipoProductoA.set('1');
    }
    if (producto.tipo_producto == 'No perecedero') {
      this.tipoProductoA.set('2');
    }
    this.precioA.set(producto.precio.toString());
    this.mostrarFormularioActualizar();
  }

  public mostrarFormulario() {
    this.switchFormularioCrear.set(!this.switchFormularioCrear());
  }
  public mostrarFormularioActualizar() {
    this.switchFormularioActualizar.set(!this.switchFormularioActualizar());
  }

  private buscarUrl(idProducto: number): string {
    const imagen = this.listaImagenes().find(imagenActual => imagenActual.idProducto === idProducto);
    return imagen ? imagen.url : 'assets/default-image.jpg';
  }


  private buscarIdMarca(nombre: string) {
    const marca = this.listaMarcas().find((marca) => marca.nombre == nombre);
    if (marca) {
      return marca.id_marca;
    } else {
      return 0;
    }
  }

  private buscarIdCategoria(nombre: string) {
    const categoria = this.listaCategorias().find((categoria) => categoria.nombre == nombre);
    if (categoria) {
      return categoria.id_categoria;
    } else {
      return 0;
    }
  }

  public registrarProducto(event: Event) {
    event.preventDefault();
    const codigo = this.codigo();
    const descripcion = this.descripcion();
    const marca = +this.marca();
    const categoria = +this.categoria();
    const tipoProducto = +this.tipoProducto();
    const precio = +this.precio();
    this.productoService.registrarProducto(codigo, descripcion, marca, categoria, tipoProducto, precio).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El producto fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar producto: " + errorMessage, 'Error');
        }
      }
    });

    this.mostrarFormulario();
    this.codigo.set('');
    this.descripcion.set('');
    this.marca.set('');
    this.categoria.set('');
    this.tipoProducto.set('');
    this.precio.set('');
  }

  public actualizarProducto(event: Event) {
    //Todo: implementar
    event.preventDefault();
    const id = +this.id_producto();
    const codigo = this.codigoA();
    const descripcion = this.descripcionA();
    const marca = this.buscarIdMarca(this.marcaA());
    if (marca == 0) {
      alert('marca no encontrada');
      return;
    }
    const categoria = this.buscarIdCategoria(this.categoriaA());
    if (categoria == 0) {
      alert('categoria no encontrada');
      return
    }
    const tipoProducto = +this.tipoProductoA()
    if (tipoProducto <= 0 || tipoProducto >= 3) {
      alert('Disponibles:Perecedero= 1 y No perecedero= 2');
      return;
    }
    const precio = +this.precioA();
    this.productoService.actualizarProducto(id, codigo, descripcion, marca, categoria, tipoProducto, precio).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El producto fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar producto: " + errorMessage, 'Error');
        }
      }
    });

    this.mostrarFormularioActualizar();
    this.codigoA.set('');
    this.descripcionA.set('');
    this.marcaA.set('');
    this.categoriaA.set('');
    this.tipoProductoA.set('');
    this.precioA.set('');
  }

  public onFileSelected(event: any, productoId: number) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);  // Archivo seleccionado
    formData.append('upload_preset', 'electrodomesticos');  // El nombre del preset
    formData.append('public_id', `producto_${productoId}`);  // Nombre personalizado del archivo

    // Subir a Cloudinary
    fetch('https://api.cloudinary.com/v1_1/diqqfka6g/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log('Imagen subida:', data);
        // this.imageUrl.(data.secure_url);
        this.imagenService.registrarImagen(data.secure_url, productoId);  // URL de la imagen subida
      })
      .catch(err => console.error('Error:', err));
  }

  ngOnInit(): void {
    this.productoService.obtenerProductos();
    this.imagenService.obtenerTodasLasImagenes();
    this.marcaService.obtenerMarcas();
    this.categoriaService.obtenerCategorias();
  }
}
