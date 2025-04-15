import { Component, OnInit } from '@angular/core';
import { personal } from '../../../interface/personal';
import { Personal } from '../../../interface/Personal2';
import { rol } from '../../../interface/roles';
import { turno } from '../../../interface/turno';
import { PersonalService } from '../../../services/personal.service';
import { RolesService } from '../../../services/roles.service';
import { TurnoService } from '../../../services/turno.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interface/user';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-user',
  imports: [FormsModule,CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export default class UserComponent implements OnInit {
  mostrarFormulario = false;

  nuevoPersonal = {
    nombre: '',
    apellido: '',
    carnet: '',
    fecha_creacion: new Date(),
    id_rol: undefined,
    id_turno: undefined,
  };
  

  newUser = {
    username: '',
    password: '',
    email: '',
  };

  listaPersonal: Personal[] = []; // Usamos el tipo 'Personal' aquí

  listaRoles = [
    { id_rol: 1, nombre: 'Administrador' },
    { id_rol: 2, nombre: 'Empleado' }
  ];

  listarTurnos = [
    { id_turno: 1, descripcion: 'Mañana' },
    { id_turno: 2, descripcion: 'Tarde' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.cargarPersonal();
  }

  cargarPersonal(): void {
    // Simulamos la carga de datos en la tabla
    this.listaPersonal = [
      { nombre: 'Juan', apellido: 'Pérez', carnet: '12345', fecha_creacion: '2021-05-01', id_rol: 1, id_turno: 1 },
      { nombre: 'Ana', apellido: 'García', carnet: '67890', fecha_creacion: '2022-01-15', id_rol: 2, id_turno: 2 }
    ];
  }

  crearPersonal(): void {
    // Asegúrate de que fecha_creacion sea un objeto Date
    const fechaCreacion = this.nuevoPersonal.fecha_creacion instanceof Date
      ? this.nuevoPersonal.fecha_creacion
      : new Date(this.nuevoPersonal.fecha_creacion);
  
    // Añadimos el nuevo personal a la lista (sin llamadas API)
    this.listaPersonal.push({
      ...this.nuevoPersonal,
      fecha_creacion: fechaCreacion.toLocaleDateString(),
    });
  
    // Limpiamos los campos
    this.nuevoPersonal = { nombre: '', apellido: '', carnet: '', fecha_creacion: new Date(), id_rol: undefined, id_turno: undefined };
  
    // Cerramos el formulario
    this.mostrarFormulario = false;
  }
  
  
  
}
