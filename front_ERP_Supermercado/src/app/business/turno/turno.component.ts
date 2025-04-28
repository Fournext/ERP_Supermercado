import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { turno } from '../../../interface/turno';

@Component({
  selector: 'app-turno',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './turno.component.html',
  styleUrl: './turno.component.css'
})
export default class TurnoComponent {

  turnos :  turno[] = [];
  turnoModal : turno = {} as turno;

  descripcion : string = '';
  horaEntrada: Date = new Date();
  horaSalida: Date = new Date();
  constructor(private turnoServicio: TurnoService) { }

  ngOnInit(): void {
    this.mostrarTurnos();
  }

  mostrarTurnos() {
    this.turnoServicio.listaTunos().subscribe((turnos) => {
      this.turnos = turnos;
    })
  }

  eliminarTurno(id: number): void {
    this.turnoServicio.eliminarTurno(id).subscribe(() => {
      this.mostrarTurnos();
    })
  }

  update : boolean = false;
  crearTurno() {
    if (this.update){
      this.actualizarTurno(this.turnoModal.id_turno!);
      this.update = false;  
    }else{
      this.turnoServicio.crearTurno(this.turnoModal).subscribe(() => {
        this.mostrarTurnos();
        this.cerrarModal();
      })
    }
  }

  actualizarTurno(id: number) {
    this.turnoServicio.actualizarTurno(id, this.turnoModal).subscribe(() => {
      this.mostrarTurnos();
      this.cerrarModal();
    })
  }

  editarTurno(turno: turno) {
    this.turnoModal = turno;
    this.update = true;
    this.abrirModal();
  }

  // Modal de guardar
  mostrarModal: boolean = false;
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.turnoModal = {} as turno;
    this.update = false;
  }
}
