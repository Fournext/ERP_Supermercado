import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { rol } from '../../../interface/roles';
import { RolesService } from '../../../services/roles.service';

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

  constructor(private rolService: RolesService) { }

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

}
