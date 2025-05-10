import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { MetodoPagoService } from '../../../services/metodoPago.service';
import { ProductoService } from '../../../services/producto.service';
import { ComprasService } from '../../../services/compras.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DetalleBoletaService } from '../../../services/detalleBoleta.service';
import { Router } from '@angular/router';
import BoletaCompraComponent from "../boletaCompra/boletaCompra.component";
import { BoletaCompra, DetalleCompra } from '../../../interface/compras.interface';
import { BitacoraService } from '../../../services/bitacora.service';

@Component({
  selector: 'app-compras-page',
  imports: [BoletaCompraComponent],
  templateUrl: './compras-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComprasPageComponent {
  //injecciones
  private proveedorService = inject(ProveedorService);//aqui vamos a llamar al metodo pago
  private metodoPagoService = inject(MetodoPagoService);
  private productoService = inject(ProductoService);
  public boletaCompraService = inject(ComprasService);
  private toastr = inject(ToastrService);
  private detalleBoletaService = inject(DetalleBoletaService);
  private router = inject(Router);
  private detalleService = inject(DetalleBoletaService);
   private bitacoraService=inject(BitacoraService);


  //propiedades para manejar los formularios

  //registrar
  idBoleta = signal<number>(0);
  costoTotal = signal<string>('');
  fecha = signal<string>('');
  idProveedor = signal<number>(0);
  idMetodoPago = signal<number>(0);
  estado = signal<string>('Completado');
  //registrar detalle de compra
  cantidad = signal<string>('');
  costoUnitario = signal<string>('');
  idProducto = signal<number>(0);

  listaDetalles = signal<any[]>([]);

  //editar detalle de compra
  cantidadActualizado = signal<string>('');
  costoUnitarioActualizado = signal<string>('');
  idProductoActualizado = signal<string>('');

  nombreProducto = signal<string>('');

  //proveedor
  listaProveedor = computed(() => this.proveedorService.listaProveedor());
  //metodo pago
  listaMetodoPago = computed(() => this.metodoPagoService.listaMetodoPago());
  //productos
  listaProductos = computed(() => this.productoService.listaProductos());
  //boleta de compras
  listaBoletaCompras = computed(() => this.boletaCompraService.listaBoletaCompra());

  //para agregar detalles de productos

  //lista para mostrar los detalles de los productos


  //lista para mostrar las compras realizadas

  buscarProveedor(id: number) {
    const proveedor = this.listaProveedor().find((proveedor) => proveedor.idProveedor == id);
    return proveedor?.nombre;
  }
  buscarMetodo(id: number) {
    const metodo = this.listaMetodoPago().find((metodo) => metodo.metodoPagoId == id);
    return metodo?.nombre;
  }
  buscarProducto(id: number) {
    const producto = this.listaProductos().find((producto) => producto.idProducto == id);
    return producto?.descripcion;
  }

  buscarProductoNombre(nombre: string) {
    const producto = this.listaProductos().find((producto) => producto.descripcion == nombre);
    console.log(producto?.idProducto);
    return producto?.idProducto;
  }

  asignarProducto(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idProducto.set(+valor);
    console.log(valor);
  }

  asignarProveedor(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idProveedor.set(+valor);
    console.log(valor);
  }
  asignarMetodoPago(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idMetodoPago.set(+valor);
    console.log(valor);
  }

  fechaFormateado(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses: 0-11
    const day = String(date.getDate()).padStart(2, '0');

    const formateado = `${year}-${month}-${day}`;
    this.fecha.set(formateado);
  }


  registrarBoletaCompra() {
    const costoTotal = +this.costoTotal();
    const fecha = this.fecha();
    const idProveedor = this.idProveedor();
    const idMetodo = this.idMetodoPago();
    const estado = this.estado();
    this.boletaCompraService.registrarBoletaCompra(costoTotal, fecha, idProveedor, idMetodo, estado).subscribe({
      next: (resp: any) => {
        this.idBoleta.set(resp.idBoletaCompra);
        console.log(resp);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La boleta fue regisrada pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar la boleta: " + errorMessage, 'Error');
        }
      }
    });
    this.bitacoraService.ActualizarBitacora(`Registro una boleta de compra del proveedor con id: ${idProveedor}`);
  }

  eliminarBoletaCompra(boleta: BoletaCompra) {
    console.log(boleta);
    const id = boleta.idBoletaCompra;
    this.boletaCompraService.editarBoletaCompra(id, boleta.idBoletaCompra, boleta.costoTotal, boleta.fecha, boleta.idProveedor, boleta.idMetodoPago, 'Eliminado').subscribe(
      (response)=>{
        this.toastr.success("Eliminado exitosamente");
      }
    )
    this.bitacoraService.ActualizarBitacora(`Elimino la boleta de compra con id: ${boleta.idBoletaCompra}`);
  }

  agregarDetalleProducto() {
    const idBoleta = this.idBoleta();
    const cantidad = this.cantidad();
    const costoUnitario = this.costoUnitario();
    const idProducto = this.idProducto();
    const detalle = {
      cantidad: cantidad,
      costoUnitario: costoUnitario,
      idBoleta: idBoleta,
      idProducto: idProducto
    }
    this.listaDetalles.update((actual) => [...actual, detalle]);
    console.log(this.listaDetalles());
  }
  //actualizar detalle
  editarDetalleBoleta() {
    const idProductoActualizado = this.buscarProductoNombre(this.nombreProducto());
    const cantidadActualizado = +this.cantidadActualizado();
    const costoUnitarioActualizado = +this.costoUnitarioActualizado(); 0

    console.log(idProductoActualizado);
    console.log(cantidadActualizado);
    console.log(costoUnitarioActualizado);
    this.listaDetalles.update(detalles =>
      detalles.map(detalle => {
        if (detalle.idProducto === idProductoActualizado) {
          return {
            ...detalle,
            cantidad: cantidadActualizado,
            costoUnitario: costoUnitarioActualizado,
            idProducto: idProductoActualizado
          }
        }
        return detalle;
      })
    )
    console.log(this.listaDetalles());
  }

  eliminarDetalle(id: number) {
    this.listaDetalles.update(detalles =>
      detalles.filter(detalle => detalle.idProducto != id)
    )
  }

  registrarDetalleBoleta() {
    console.log('entra');
    console.log(this.listaDetalles());
    this.listaDetalles().forEach((detalle) => {
      console.log(detalle);
      this.bitacoraService.ActualizarBitacora(`Adiciono el producto con id: ${detalle.idProducto} a la boleta de compra`);
      this.detalleBoletaService.registrarDetalleBoletaCompra(detalle.cantidad, detalle.costoUnitario, detalle.idBoleta, detalle.idProducto);
    });
    this.listaDetalles.set([]);
    this.fecha.set('');
    this.idProveedor.set(0);
    this.idMetodoPago.set(0);
    this.cantidad.set('');
    this.costoUnitario.set('');
    this.idProducto.set(0);
  }

  verBoletaCompra(boleta: BoletaCompra) {
    this.boletaCompraService.boletaCompraActual.set(boleta);
    this.detalleService.obtenerDetallesBoletaCompra(boleta.idBoletaCompra).subscribe(
      (response: DetalleCompra[]) => {
        this.boletaCompraService.listaDetalleActual.set(response);
      }
    )
    this.boletaCompraService.verBoletaSwitch();

  }

  ngOnInit() {
    this.metodoPagoService.getMetodoPagos();
    this.proveedorService.obtenerListaProveedores();
    this.productoService.obtenerProductos();
    this.boletaCompraService.getBoletaCompras();
  }
}
