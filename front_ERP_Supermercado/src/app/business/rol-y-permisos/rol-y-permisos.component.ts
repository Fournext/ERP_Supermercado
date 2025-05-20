import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { rol } from '../../../interface/roles';
import { RolesService } from '../../../services/roles.service';
import { Permiso } from '../../../interface/permiso';
import { PermisosService } from '../../../services/permisos.service';

@Component({
  selector: 'app-rol-y-permisos',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './rol-y-permisos.component.html',
  styleUrl: './rol-y-permisos.component.css'
})
export default class RolYPermisosComponent {

  roles: rol[] = [];
  rolModal: rol = {} as rol;
  update: boolean = false;

  mostrarModalPermisos = false;
  rolSeleccionado: rol | null = null;
  nuevoPermiso: Permiso = { vista: '', ver: false, insertar: false, editar: false, eliminar: false, idRol: 0 };
  vistasDisponibles = ['Dashboard', 'Usuario', 'Producto', 'Compra', 'Boleta De Salida', 'Almacen']; // etc
  permisosList: Permiso[] = [];

  constructor(
    private rolService: RolesService,
    private permisosService: PermisosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarRoles();
  }


  eliminarRol(rolId: number) {
    this.rolService.eliminarRol(rolId).subscribe(() => {
      this.listarRoles();
    });
  }

  listarRoles() {
    this.rolService.listarRoles().subscribe(roles => {
      this.roles = roles;
    })
  }

  crearRol() {
    if(this.update) {
      this.actualizarRol(this.rolModal.id_rol!);
      this.update = false;
    } else {
      this.rolService.crearRol(this.rolModal).subscribe(() => {
        this.listarRoles();
        this.cerrarModal();
      })
    }
  }

  actualizarRol(id_rol: number) {
    this.rolService.editarRol(this.rolModal, id_rol).subscribe(() => {
      this.listarRoles();
      this.cerrarModal();
    })
  }

  editarRol(rol: rol) {
    this.rolModal = rol;
    this.abrirModal();
    this.update = true;
  }
  // Modal de guardar
  mostrarModal: boolean = false;
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.rolModal = {} as rol;
    this.update = false;
  }


abrirModalPermisos(rol: rol) {
    this.rolSeleccionado = rol;
    this.mostrarModalPermisos = true;
    this.nuevoPermiso = {
      vista: '', ver: false, insertar: false, editar: false, eliminar: false, idRol: rol.id_rol!
    };

    this.permisosService.getPermisoRol(rol.id_rol!).subscribe((permisos: Permiso[]) => {
      this.permisosList = [...permisos]; // Forzar nueva referencia
      this.cdr.detectChanges(); // 🔥 Forzar render si Angular no detecta cambios
    });
  }

  cerrarModalPermisos() {
    this.mostrarModalPermisos = false;
    this.rolSeleccionado = null;
    this.permisosList = [];
  }

  agregarPermiso() {
    if (!this.rolSeleccionado) return;

    if (this.rolSeleccionado.id_rol === undefined) return;
    const permisoConRol = {
      ...this.nuevoPermiso,
      idRol: this.rolSeleccionado.id_rol as number
    };

    this.permisosService.newPermiso(permisoConRol).subscribe(() => {
      this.permisosService.getPermisoRol(this.rolSeleccionado!.id_rol!).subscribe(permisos => {
        this.permisosList = [...permisos];
        this.nuevoPermiso = {
          vista: '', ver: false, insertar: false, editar: false, eliminar: false, idRol: this.rolSeleccionado!.id_rol!
        };
        this.cdr.detectChanges();
      });
    });
  }

  editarPermiso(permiso: Permiso) {
    this.nuevoPermiso = { ...permiso };
  }

  eliminarPermiso(permiso: Permiso) {
    if (!permiso.id_permiso) return;
    this.permisosService.deletePermiso(permiso.id_permiso).subscribe(() => {
      this.permisosList = this.permisosList.filter(p => p.id_permiso !== permiso.id_permiso);
      this.cdr.detectChanges();
    });
  }

  trackByPermiso(index: number, permiso: Permiso): any {
    return permiso.id_permiso || index;
  }

}
