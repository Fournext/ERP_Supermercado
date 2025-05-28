import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BoletaRecepcionService } from '../../../services/boleta-recepcion.service';
import { BoletaRecepcion } from '../../../interface/boleta_recepcion';

@Component({
  selector: 'app-valoracion',
  imports: [CommonModule, FormsModule],
  templateUrl: './valoracion.component.html',
  styleUrl: './valoracion.component.css'
})
export default class ValoracionComponent implements OnInit {
  valoraciones: BoletaRecepcion[] = [];
  promedio: number = 0;

  constructor(
    private toastr: ToastrService,
    private boletaService: BoletaRecepcionService
  ) {}

  ngOnInit(): void {
    this.cargarValoraciones();
  }

  cargarValoraciones() {
    this.boletaService.getBoletas_Recepcion().subscribe(
      (data: BoletaRecepcion[]) => {
        this.valoraciones = data;
        this.calcularPromedio();
      },
      (error) => {
        this.toastr.error('Error al cargar valoraciones', 'Error');
      }
    );
  }

  calcularPromedio() {
    if (this.valoraciones.length === 0) {
      this.promedio = 0;
      return;
    }
    const total = this.valoraciones.reduce((sum, v) => sum + (v.puntaje || 0), 0);
    this.promedio = total / this.valoraciones.length;
  }
}
