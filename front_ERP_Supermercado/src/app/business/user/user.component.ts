import { Component, OnInit } from '@angular/core';
import { Personal } from '../../../interface/Personal2';
import { PersonalService } from '../../../services/personal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  imports: [FormsModule,CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export default class UserComponent implements OnInit {

  constructor(
    private personalService: PersonalService,
    private toastr: ToastrService,
  ) { }


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

  //atributo que sera el motivo para eliminar el personal/usuario y la fecha la insertaremos directamente
  idPersonal:number=1;
  motivo: string = 'Se tiro en Si1';

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

  eliminarPersonal(persona: any): void {
    const confirmacion = confirm(`¿Estás seguro de eliminar a ${persona.nombre}?`)
    const hoy = new Date();
    const fecha = hoy.toISOString().slice(0, 10); // yyyy-MM-dd
    // const idPersonal: number = 1;
    // const fecha = '2025-04-21';
    // const motivo = 'Tuvo un hijo'
    if (confirmacion) {
      this.personalService.eliminarPersonalByEstado(this.idPersonal, fecha, this.motivo)
        .subscribe(response => {
          console.log('Se elimino el personal correctamente', response);
        }, error => {
          console.error('Error al eliminar personal:', error);
        });

    }
  }
}
