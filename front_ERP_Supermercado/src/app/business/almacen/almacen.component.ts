import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlmacenService } from '../../../services/almacen.service';
import { Almacen } from '../../../interface/almacen';
import { HttpErrorResponse } from '@angular/common/http';
import { BitacoraService } from '../../../services/bitacora.service';

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export default class AlmacenComponent implements OnInit {

  filtroCodigo = '';
  mostrarModal = false;
  editando = false;
  almacenList: Almacen[] = [];
  nuevoAlmacen: Almacen = { id_almacen: 0, codigo: '', dimenciones: '0' }; // ← corregido tipo

  constructor(
    private toastr: ToastrService,
    private almaceneServices: AlmacenService,
    private _bitacoraservices: BitacoraService,
  ) {}

  ngOnInit(): void {
    this.getAlmacenes();
  }

  getAlmacenes() {
    this.almaceneServices.getAlmacenes().subscribe((data) => {
      this.almacenList = data;
    });
  }

  almacenListFiltered() {
    return this.almacenList.filter(a =>
      a.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase())
    );
  }

  abrirModal(edit = false, almacen: Almacen | null = null) {
    this.mostrarModal = true;
    this.editando = edit;
    if (edit && almacen) {
      this.nuevoAlmacen = { ...almacen }; 
    } else {
      this.nuevoAlmacen = { id_almacen: 0, codigo: '', dimenciones: '0' };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarAlmacen() {
    if (!this.nuevoAlmacen.codigo.trim() || Number(this.nuevoAlmacen.dimenciones) <= 0) {
      this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error');
      return;
    }

    if (this.editando) {
      const index = this.almacenList.findIndex(a => a.id_almacen === this.nuevoAlmacen.id_almacen);
      if (index !== -1) {
        this.almaceneServices.editarAlmacen(this.nuevoAlmacen).subscribe({
          next: (response: any) => {  
            this.toastr.success('Almacén Actualizado correctamente.', 'Éxito');
            this.getAlmacenes();
            this._bitacoraservices.ActualizarBitacora("Edito el Almacen con ID y COD: "+this.nuevoAlmacen.id_almacen+" -- "+this.nuevoAlmacen.codigo);
            this.cerrarModal(); 
          },
          error: (e: HttpErrorResponse) => {
            const errorMessage = e.error?.detail || e.error?.message || 'Error al editar';
            this.toastr.error(errorMessage, "Error");
          }
        });
      }
    }else {
      this.almaceneServices.newAlmacen(this.nuevoAlmacen).subscribe({
        next: (response: any) => {  
          this.toastr.success('Almacén Insertado correctamente.', 'Éxito');
          this.getAlmacenes();
          this._bitacoraservices.ActualizarBitacora("Agregó un nuevo Almacen con COD: "+this.nuevoAlmacen.codigo);
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

  eliminarAlmacen(almacen:Almacen) {
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
        this.almaceneServices.deleteAlmacen(almacen.id_almacen!).subscribe({
          next:(response:any) => {
            this.toastr.warning('Almacén eliminado correctamente.', 'Éxito');
            this.getAlmacenes();
            this._bitacoraservices.ActualizarBitacora("Elimino el Almacen con ID y COD: "+almacen.id_almacen+" -- "+almacen.codigo);
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
