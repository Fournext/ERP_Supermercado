import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Proveedor } from '../../../interface/proveedore.interface';
import { BitacoraService } from '../../../services/bitacora.service';

@Component({
  selector: 'app-proveedores',
  imports: [],
  templateUrl: './proveedores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProveedoresComponent {
  private proveedorService = inject(ProveedorService);
  private toastr = inject(ToastrService);
  //bitacora
  private bitacoraService=inject(BitacoraService);
  //obtenemos el username


  //datos estaticos
  estados = ['Activo', 'No activo'];
  //Switch para el formulario actualizar
  activarFormularioRegistrar = signal<Boolean>(false);
  //datos para el formulario de crear
  nombre = signal('');
  direccion = signal('');
  estado = signal('');

  //datos del formulario de actualizar
  id = signal(0);
  nuevoNombre = signal('');
  nuevaDireccion = signal('');
  nuevoEstado = signal('');

  //podriamos hacerlo persistente en el local storage

  listaDeProveedores = computed(() => (this.proveedorService.listaProveedor()));

  mostrarFormularioActualizar(proveedor: Proveedor) {
    this.id.set(proveedor.idProveedor),
      this.nuevoNombre.set(proveedor.nombre);
    this.nuevaDireccion.set(proveedor.direccion);
    this.nuevoEstado.set(proveedor.estado);
    this.activarFormularioRegistrar.set(!this.activarFormularioRegistrar());
  }

  buscarProveedor(nombre: string): Boolean {
    const proveedor = this.listaDeProveedores().find((proveedor: Proveedor) => (proveedor.nombre == nombre));
    if (proveedor) {
      return true;
    } else {
      return false;
    }
  }

  registrarProveedor() {
    console.log('entra');
    const nombre: string = this.nombre().trim();
    const direccion: string = this.direccion().trim();
    const estado: string = this.estado().trim();
    if (this.buscarProveedor(nombre)) {
      alert('Proveedor ya registrado');
      return;
    }
    if (!this.estados.find((estadoActual) => (estadoActual == estado))) {
      alert('Estado no disponible, disponibles: Activo y No activo');
      return;
    }
    if (nombre.length == 0) {
      alert('Nombre obligatorio');
      return;
    }
    if (direccion.length == 0) {
      alert('Direccion obligatorio');
      return;
    }
    this.proveedorService.registrarProveedor(nombre, direccion, estado).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";
        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La marca fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar marca: " + errorMessage, 'Error');
        }
      }
    })
    this.bitacoraService.ActualizarBitacora(`Registro el proveedor: ${nombre}`);
    this.nombre.set('');
    this.direccion.set('');
    this.estado.set('');
  }

  actualizarProveedor() {
    console.log('entra');
    const id: number = this.id();
    const nombre: string = this.nuevoNombre().trim();
    const direccion: string = this.nuevaDireccion().trim();
    const estado: string = this.nuevoEstado().trim();
    if (!this.estados.find((estadoActual) => (estadoActual == estado))) {
      alert('Estado no disponible, disponibles: Activo y No activo');
      return;
    }
    if (nombre.length == 0) {
      alert('Nombre obligatorio');
      return;
    }
    if (direccion.length == 0) {
      alert('Direccion obligatorio');
      return;
    }
    this.proveedorService.actualizarProveedor(id, nombre, direccion, estado).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success("Actualizacion exitosa");
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";
        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El proveedor fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al actualizar el proveedor: " + errorMessage, 'Error');
        }
      }
    })

    this.bitacoraService.ActualizarBitacora(`Actualizo el proveedor: ${nombre}`);

    this.id.set(0),
    this.nuevoNombre.set('');
    this.nuevaDireccion.set('');
    this.nuevoEstado.set('');
    this.activarFormularioRegistrar.set(!this.activarFormularioRegistrar());
  }

  habilitarDesctivarProveedor(proveedor: Proveedor) {
    const id: number = proveedor.idProveedor;
    const nombre: string = proveedor.nombre;
    const direccion: string = proveedor.direccion;
    let estado: string = '';
    if (proveedor.estado == 'Activo') {
      estado = 'No activo';
      this.proveedorService.actualizarProveedor(id, nombre, direccion, estado).subscribe({
        next: (response: any) => {
          console.log(response);
          this.toastr.success("Proveedor Eliminado");
        }
      })
    } else {
      estado = 'Activo';
      this.proveedorService.actualizarProveedor(id, nombre, direccion, estado).subscribe({
        next: (response: any) => {
          console.log(response);
          this.toastr.success("Proveedor Restaurado");
        }
      })
    }
    this.bitacoraService.ActualizarBitacora(`Modifico el proveedor: ${nombre}`);

  }

  //con esto cada vez que se recarge la pagina obtendra la lista de proveedores
  ngOnInit() {
    this.proveedorService.obtenerListaProveedores();
    this.bitacoraService.getUsernameFromToken();
  }
}
