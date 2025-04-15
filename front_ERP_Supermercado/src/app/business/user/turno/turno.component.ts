import { Component, OnInit } from '@angular/core';
import { turno } from '../../../../interface/turno';
import { TurnoService } from '../../../../services/turno.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turno',
  imports: [FormsModule,CommonModule],
  templateUrl: './turno.component.html',
  styleUrl: './turno.component.css'
})
export default class TurnoComponent implements OnInit {
  mostrarFormulario = false;

  nuevoTurno: turno = {
    descripcion: '',
    horaEntrada: new Date(),
    horaSalida: new Date(),
  };

  listaTurnos: turno[] = [];
  turnoEnEdicion: any = null;

  constructor(private turnoService: TurnoService) { }

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.turnoService.listaTunos().subscribe((data) => {
      this.listaTurnos = data.map(t => ({
        ...t,
        horaEntrada: new Date(`1970-01-01T${t.horaEntrada}`),
        horaSalida: new Date(`1970-01-01T${t.horaSalida}`)
      }));
    });
  }

  crearTurno(): void {
    this.turnoService.crearTurno(this.nuevoTurno).subscribe(() => {
      this.cargarTurnos();
      this.limpiarFormulario();
    });
  }

  actualizarTurno(turno: turno): void {
    this.turnoService.actualizarTurno(turno.id_turno!, turno).subscribe(() => {
      this.cargarTurnos();
      this.limpiarFormulario();
    });
  }

  eliminarTurno(id?: number): void {
    if (id) {
      this.turnoService.eliminarTurno(id).subscribe(() => {
        this.cargarTurnos();
      });
    }
  }

  // Iniciar edición de turno (cargar datos en el formulario)
  editarTurno(turno: any) {
    this.turnoEnEdicion = { ...turno }; // Copiar los datos del turno seleccionado al modelo de edición
    this.nuevoTurno = { ...turno }; // Copiar los datos al formulario
    this.mostrarFormulario = true; // Mostrar el formulario
  }

  // Guardar turno (crear o actualizar)
  guardarTurno() {
    if (this.turnoEnEdicion) {
      // Si hay un turno en edición, se actualiza
      this.actualizarTurno(this.turnoEnEdicion); // Llamar al servicio para actualizar()
    } else {
      // Si no, se crea uno nuevo
      this.crearTurno();
    }
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.nuevoTurno = { descripcion: '', horaEntrada: new Date(), horaSalida: new Date() };
    this.turnoEnEdicion = null;
    this.mostrarFormulario = false;
  }

  // Formatear hora para mostrar en el formato deseado
  formatHora(horaStr: string): string {
    const [h, m] = horaStr.split(':');
    return `${h}:${m}`;
  }
}
