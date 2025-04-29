import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sector } from '../../../interface/sector';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../services/sector.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sector',
  imports: [CommonModule, FormsModule],
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.css'
})
export default class SectorComponent implements OnInit{
  
  filtroNombre = '';
  mostrarModal = false;
  editando = false;
  sectorList: Sector[] = [];
  nuevoSector: Sector = { id_sector: 0, nombre: '', ubicacion: '' }; 

  constructor(
    private toastr: ToastrService,
    private sectorServices: SectorService,
  ) {}

  ngOnInit(): void {
    this.getSectores();
  }

  getSectores() {
    this.sectorServices.getSectores().subscribe((data) => {
      this.sectorList = data;
    });
  }

  SectorListFiltered() {
    return this.sectorList.filter(a =>
      a.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  abrirModal(edit = false, sector: Sector | null = null) {
    this.mostrarModal = true;
    this.editando = edit;
    if (edit && sector) {
      this.nuevoSector = { ...sector }; 
    } else {
      this.nuevoSector = { id_sector: 0, nombre: '', ubicacion: '' };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarSector() {
    if (!this.nuevoSector.nombre.trim() || !this.nuevoSector.ubicacion.trim()) {
      this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error');
      return;
    }

    if (this.editando) {
      const index = this.sectorList.findIndex(a => a.id_sector === this.nuevoSector.id_sector);
      if (index !== -1) {
        this.sectorServices.editarSector(this.nuevoSector).subscribe({
          next: (response: any) => {  
            this.toastr.success('Sector Actualizado correctamente.', 'Éxito');
            this.getSectores();
            this.cerrarModal(); 
          },
          error: (e: HttpErrorResponse) => {
            const errorMessage = e.error?.detail || e.error?.message || 'Error al editar';
            this.toastr.error(errorMessage, "Error");
          }
        });
      }
    }else {
      this.sectorServices.newSector(this.nuevoSector).subscribe({
        next: (response: any) => {  
          this.toastr.success('Sector Insertado correctamente.', 'Éxito');
          this.getSectores();
          this.cerrarModal();
        },
        error: (e: HttpErrorResponse) => {
          const errorMessage = e.error?.detail || e.error?.message || 'Error al insertar';  
          this.toastr.error(errorMessage, "Error");
        }
      });      
    }

    this.cerrarModal();
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
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.sectorServices.deleteSector(id).subscribe({
          next:(response:any) => {
            this.toastr.warning('Sector eliminado correctamente.', 'Éxito');
            this.getSectores();
          },
          error:(e: HttpErrorResponse) => {
            const errorMessage = e.error?.detail || e.error?.message || 'Error al insertar';  
            this.toastr.error(errorMessage, "Error del Servidor");
          }
        });
      }
    });
  }
}
