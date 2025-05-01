import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../../services/personal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { personal } from '../../../interface/personal';
import { rol } from '../../../interface/roles';
import { turno } from '../../../interface/turno';
import { RolesService } from '../../../services/roles.service';
import { TurnoService } from '../../../services/turno.service';
import { User } from '../../../interface/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export default class UserComponent implements OnInit {

  personal: personal[] = [];
  roles : rol[] = [];
  turnos : turno[] = [];
  users: User[] = [];
  personalModal : personal = {} as personal;

  constructor(private personalService: PersonalService,
    private rolServicio: RolesService,
    private turnoService: TurnoService,
    private userService: UserService ) { }

  ngOnInit(): void {
    this.mostrarPersonal();
    this.cargarRoles();
    this.cargarTurnos();
    this.cargarUsers();
  }


  obtenerRol(id_rol: number) {
    let nombreRol: string = '';
    this.roles.forEach((rol) => {
      if (rol.id_rol == id_rol) {
        nombreRol = rol.nombre;
      }
    })
    return nombreRol;
  }

  obtenerTurno(id_turno: number) {
    let nombreTurno : string = '';
    this.turnos.forEach((turno) => {
      if (turno.id_turno == id_turno) {
        nombreTurno = turno.descripcion;
      }
    })
    return nombreTurno;
  }

  cargarRoles() {
    this.rolServicio.listarRoles().subscribe((rol) => {
      this.roles = rol;
    })
  }

  cargarTurnos() {
    this.turnoService.listaTunos().subscribe((turno) => {
      this.turnos = turno;
    })
  }

  cargarUsers() {
    this.userService.listarUsuarios().subscribe((user) => {
      this.users = user;
    })  
  }
  mostrarPersonal() {
    this.personalService.listarPersonal().subscribe((personal) => {
      this.personal = personal;
      console.log(personal); 
    })
  }

  eliminarPersonal(id: number) {
    this.personalService.eliminarPersonal(id).subscribe(() => {
      this.mostrarPersonal();
    })
  }

  update : boolean = false;
  crearPersonal() {
    if(this.update){
      this.actualizarPersonal(this.personalModal.id_personal!);
      this.update = false;
    }else{
      this.personalService.crearPersonal(this.personalModal).subscribe(() => {
        this.mostrarPersonal();
        this.cerrarModal();
      })
    }
  }
  actualizarPersonal(id: number) {
    this.personalService.actualizarPersonal(id, this.personalModal).subscribe(() => {
      this.mostrarPersonal();
      this.cerrarModal();
    })
  }

  editarPersonal(personal: personal) {
    this.personalModal = personal;
    this.abrirModal();
    this.update = true;
  }

  // --------------------Modal-------------------------------
  mostrarModal = false;

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.personalModal = {} as personal;
    this.update = false;
  }
  // ---------------------------------------------------------

}
