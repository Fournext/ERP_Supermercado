import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lote } from '../../../interface/lote';
import { BoletaSalida } from '../../../interface/boleta_salida';
import { ToastrService } from 'ngx-toastr';
import { PersonalService } from '../../../services/personal.service';
import { LoteService } from '../../../services/lote.service';
import { BoletaSalidaService } from '../../../services/boleta-salida.service';
import { personal } from '../../../interface/personal';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { BitacoraService } from '../../../services/bitacora.service';

@Component({
  selector: 'app-boleta-salida',
  imports: [CommonModule, FormsModule],
  templateUrl: './boleta-salida.component.html',
  styleUrl: './boleta-salida.component.css'
})
export default class BoletaSalidaComponent {
  filtroInfoLote = '';
  mostrarModal = false;
  editando = false;

  personalList: personal[] = [];
  loteList: Lote[] = [];
  boleta_salidaList: BoletaSalida[] = [];
  nuevaBoletaSalida: BoletaSalida = { id_boleta: 0, id_lote: 0, id_personal: 0, lote_info: '',nombre_personal: '',fecha: ''};


  constructor(
    private toastr: ToastrService,
    private pesonalServices: PersonalService,
    private loteServices: LoteService,
    private boleta_salidaServices: BoletaSalidaService,
    private _bitacoraservices: BitacoraService,
  ) {}

  ngOnInit(): void {
    this.getBoleta_salidaServices();
    this.getPersonal();
    this.getLotes();
  }

  getBoleta_salidaServices() {
    this.boleta_salidaServices.getBoletas_Salida().subscribe((data) => {
      this.boleta_salidaList = data;
    });
  }

  getPersonal() {
    this.pesonalServices.listarPersonal().subscribe((data) => {
      this.personalList = data;
    });
  }

  getLotes() {
    this.loteServices.getLotes().subscribe((data) => {
      this.loteList = data;
    });
  }

  boleta_salidaListFiltered() {
    return this.boleta_salidaList.filter(a =>
      a.lote_info?.toLowerCase().includes(this.filtroInfoLote.toLowerCase())
    );
  }

  abrirModal() {
    this.mostrarModal = true;
    this.nuevaBoletaSalida = {  id_boleta: 0, id_lote: 0, id_personal: 0, lote_info: '',nombre_personal: '',fecha: '' };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarBoleta_salida() {
    if (this.nuevaBoletaSalida.id_lote == 0 || this.nuevaBoletaSalida.id_personal == 0 || !this.nuevaBoletaSalida.fecha.trim()) {
      this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error');
      return;
    }

    this.boleta_salidaServices.newBoleta_Salida(this.nuevaBoletaSalida).subscribe({
      next: (response: any) => {
        this.toastr.success('Boleta de salida creada correctamente.', 'Éxito');
        this.getBoleta_salidaServices();
        this._bitacoraservices.ActualizarBitacora("Agregó un nueva Boleta de salida del lote: "+this.nuevaBoletaSalida.id_lote + " -- "+"para el personal con ID: "+this.nuevaBoletaSalida.id_personal);
        this.cerrarModal();
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail || e.error?.message || 'Error al insertar';
        this.toastr.error(errorMessage, "Error");
      }
    });
  }

  eliminarBoleta_Salida(id:number, personal:String) {
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
        this.boleta_salidaServices.deleteBoleta_Salida(id).subscribe({
          next: (response: any) => {
            this.toastr.warning('Boleta de salida eliminada correctamente.', 'Éxito');
            this.getBoleta_salidaServices();
            this._bitacoraservices.ActualizarBitacora("Eliminó una Boleta de salida con ID : "+id+ " -- "+"del personal: "+personal);
            this.getLotes();
          },
          error: (e: HttpErrorResponse) => {
            const errorMessage = e.error?.detail || e.error?.message || 'Error al eliminar';
            this.toastr.error(errorMessage, "Error del Servidor");
          }
        });
      }
    });
  }
  getLotesActivos(): any[] {
    const activos = this.loteList.filter(l => l.nombre_estado === "activo");
    return activos;
  }    
    
}
