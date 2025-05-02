import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoteService } from '../../../services/lote.service';
import { Lote } from '../../../interface/lote';
import { ProductoService } from '../../../services/producto.service';
import { ProductoConPrecio } from '../../../interface/producto.interface';
import { RepisaService } from '../../../services/repisa.service';
import { Repisa } from '../../../interface/repisa';
import { AlmacenService } from '../../../services/almacen.service';
import { Almacen } from '../../../interface/almacen';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export default class InventoryComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private loteServices: LoteService,
    private productoServices: ProductoService,
    private repisaServices: RepisaService,
    private alamcenServices: AlmacenService,
  ) {}

  lotes: Lote[] = [];
  public listaProductos = computed(() => this.productoServices.listaProductos());
  Repisas: Repisa[] = [];
  Almacenes: Almacen[] = [];

  showForm = false;
  showStockModal = false;
  stockToAdd = 0;

  newLote: Lote = {
    id_lote: 0,
    descripcion_producto: '',
    stock: 0,
    stock_minimo: 0,
    fecha_caducidad: '',
    costo_unitario: 0,
    cod_repisa: '',
    cod_almacen: '',
    nombre_estado: 'activo'
  };

  ngOnInit(): void {
    this.getLotes();
    this.productoServices.obtenerProductos(); 
    this.getRepisas();
    this.getAlmacenes();
  }

  getLotes() {
    this.loteServices.getLotes().subscribe((data) => {
      this.lotes = data;
    });
  }

  getRepisas(){
    this.repisaServices.getRepisas().subscribe((data)=>{
      this.Repisas=data;
    })
  }

  getAlmacenes(){
    this.alamcenServices.getAlmacenes().subscribe((data)=>{
      this.Almacenes=data;
    })
  }


  toggleForm() {
    this.showForm = !this.showForm;
    this.resetForm();
  }

  resetForm() {
    this.newLote = {
      id_lote: 0,
      descripcion_producto: '',
      stock: 0,
      stock_minimo: 0,
      fecha_caducidad: '',
      costo_unitario: 0,
      cod_repisa: '',
      cod_almacen: '',
      nombre_estado: 'activo'
    };
  }

  saveLote() {
    if (!this.newLote.descripcion_producto) {
      this.toastr.error('Por favor, complete todos los campos correctamente.', 'Error');
      return;
    }

    if (this.newLote.id_lote) {
      const index = this.lotes.findIndex(l => l.id_lote === this.newLote.id_lote);
      if (index !== -1) {
        this.loteServices.editarLote(this.newLote).subscribe({
          next:(response: any)=> {
            this.toastr.success('Lote Actualizado correctamente.', 'Éxito');
            this.getLotes();
            this.toggleForm();
          },
          error: (e: HttpErrorResponse) => {
            const errorMessage = e.error?.detail || e.error?.message || 'Error al editar';
            this.toastr.error(errorMessage, "Error");
          }
        });
      }
    } else {
      this.loteServices.newLote(this.newLote).subscribe({
        next:(response:any) =>{
          this.toastr.success('Lote Insertado correctamente.', 'Éxito');
          this.getLotes();
          this.toggleForm();
        },
        error: (e: HttpErrorResponse) => {
          const errorMessage = e.error?.detail || e.error?.message || 'Error al insertar';
          this.toastr.error(errorMessage, "Error");
        }
      });
    }
  }

  editLote(id: number) {
    const lote = this.lotes.find(l => l.id_lote === id);
    if (lote) {
      this.newLote = { ...lote };
      this.showForm = true;
    }
  }

  deleteLote(id: number) {
    this.loteServices.deleteLote(id).subscribe({
      next:(response:any) => {
        this.toastr.success('Lote Eliminado correctamente.', 'Éxito');
        this.getLotes();
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail || e.error?.message || 'Error al Eliminar';
        this.toastr.error(errorMessage, "Error");
      }
    });
  }

  openStockModal(id: number) {
    this.stockToAdd = 0;
    this.newLote.id_lote = id;
    this.showStockModal = true;
  }

  confirmAddStock() {
    const lote = this.lotes.find(l => l.id_lote === this.newLote.id_lote);
    if (lote) {
      lote.stock += this.stockToAdd;
    }
    this.closeStockModal();
  }

  closeStockModal() {
    this.showStockModal = false;
    this.stockToAdd = 0;
  }

  trackLote(index: number, lote: any): number {
    return lote.id;
  }
}
