import { Component, OnInit } from '@angular/core';
import { Repisa } from '../../../interface/repisa';
import { Sector } from '../../../interface/sector';
import { ToastrService } from 'ngx-toastr';
import { RepisaService } from '../../../services/repisa.service';
import { SectorService } from '../../../services/sector.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repisa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repisa.component.html',
  styleUrl: './repisa.component.css'
})
export default class RepisaComponent implements OnInit {

  filtroCodigo = '';
  mostrarModal = false;
  editando = false;

  repisaList: Repisa[] = [];
  sectorList: Sector[] = [];
  nuevaRepisa: Repisa = { id_repisa: 0, codigo: '', capacidad: 0, sector: { id_sector: 0, nombre: '', ubicacion: '' } };

  selectedSectorId: number = 0; // 👈

  constructor(
    private toastr: ToastrService,
    private repisaServices: RepisaService,
    private sectorServices: SectorService,
  ) {}

  ngOnInit(): void {
    this.getRepisas();
    this.getSectores();
  }

  getRepisas() {
    this.repisaServices.getRepisas().subscribe((data) => {
      this.repisaList = data;
    });
  }

  getSectores() {
    this.sectorServices.getSectores().subscribe((data) => {
      this.sectorList = data;
    });
  }

  repisaListFiltered() {
    return this.repisaList.filter(a =>
      a.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase())
    );
  }

  abrirModal(edit = false, repisa: Repisa | null = null) {
    this.mostrarModal = true;
    this.editando = edit;
    if (edit && repisa) {
      this.nuevaRepisa = { ...repisa };
      this.selectedSectorId = repisa.sector.id_sector ?? 0;
    } else {
      this.nuevaRepisa = { id_repisa: 0, codigo: '', capacidad: 0, sector: { id_sector: 0, nombre: '', ubicacion: '' } };
      this.selectedSectorId = 0;
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarRepisa() {

    if (!this.nuevaRepisa.codigo.trim() || this.nuevaRepisa.capacidad <= 0 || this.nuevaRepisa.sector.id_sector == 0) {
      this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error');
      return;
    }

    if (this.editando) {
      this.repisaServices.editarRepisa(this.nuevaRepisa).subscribe({
        next: (response: any) => {
          this.toastr.success('Repisa actualizada correctamente.', 'Éxito');
          this.getRepisas();
          this.cerrarModal();
        },
        error: (e: HttpErrorResponse) => {
          const errorMessage = e.error?.detail || e.error?.message || 'Error al editar';
          this.toastr.error(errorMessage, "Error");
        }
      });
    } else {
      this.repisaServices.newRepisa(this.nuevaRepisa).subscribe({
        next: (response: any) => {
          this.toastr.success('Repisa insertada correctamente.', 'Éxito');
          this.getRepisas();
          this.cerrarModal();
        },
        error: (e: HttpErrorResponse) => {
          const errorMessage = e.error?.detail || e.error?.message || 'Error al insertar';
          this.toastr.error(errorMessage, "Error");
        }
      });
    }
  }

  eliminarAlmacen(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.repisaServices.deleteRepisa(id).subscribe({
          next: (response: any) => {
            this.toastr.warning('Repisa eliminada correctamente.', 'Éxito');
            this.getRepisas();
          },
          error: (e: HttpErrorResponse) => {
            const errorMessage = e.error?.detail || e.error?.message || 'Error al eliminar';
            this.toastr.error(errorMessage, "Error del Servidor");
          }
        });
      }
    });
  }

  actualizarSectorSeleccionado(event: any) {
    const idSeleccionado = Number(event.target.value);
    const sectorEncontrado = this.sectorList.find(sector => sector.id_sector === idSeleccionado);
    if (sectorEncontrado) {
      this.nuevaRepisa.sector = { ...sectorEncontrado };
    }
  }  
}
