import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export default class InventoryComponent implements OnInit {
  lotes: any[] = [];
  productos: any[] = [];
  codRepisas: string[] = [];
  codAlmacenes: string[] = [];

  showForm = false;
  showStockModal = false;
  stockToAdd = 0;

  newLote = {
    id: 0, // No más null, ahora siempre es un número
    producto: '',
    stock: 0,
    stockMinimo: 0,
    fechaCaducidad: '',
    costoUnitario: 0,
    codRepisa: '',
    codAlmacen: '',
    estado: 'activo'
  };

  ngOnInit(): void {
    this.loadStaticData();
  }

  loadStaticData() {
    this.productos = [
      { id: 1, descripcion: 'Arroz 1kg' },
      { id: 2, descripcion: 'Aceite 500ml' },
      { id: 3, descripcion: 'Harina 1kg' }
    ];

    this.codRepisas = ['A12', 'A15', 'A10', 'B5', 'B8']; // Lista de repisas
    this.codAlmacenes = ['Almacén 1', 'Almacén 2', 'Almacén 3']; // Lista de almacenes

    this.lotes = [
      { id: 101, producto: 'Arroz 1kg', stock: 20, stockMinimo: 5, fechaCaducidad: '2025-10-12', costoUnitario: Number(10), codRepisa: 'A12', codAlmacen: 'B5', estado: 'activo' },
      { id: 102, producto: 'Aceite 500ml', stock: 15, stockMinimo: 3, fechaCaducidad: '2026-06-20', costoUnitario: Number(25), codRepisa: 'A15', codAlmacen: 'B2', estado: 'activo' },
      { id: 103, producto: 'Harina 1kg', stock: 30, stockMinimo: 7, fechaCaducidad: '2024-08-30', costoUnitario: Number(8), codRepisa: 'A10', codAlmacen: 'B8', estado: 'activo' }
    ];
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.resetForm();
  }

  resetForm() {
    this.newLote = {
      id: this.lotes.length > 0 ? Math.max(...this.lotes.map(l => l.id)) + 1 : 101, // Asigna nuevo ID correctamente
      producto: '',
      stock: 0,
      stockMinimo: 0,
      fechaCaducidad: '',
      costoUnitario: 0,
      codRepisa: '',
      codAlmacen: '',
      estado: 'activo'
    };
  }
  saveLote() {
    if (!this.newLote.producto) {
      alert('Debes ingresar un producto antes de guardar.');
      return;
    }
    if (this.newLote.id) {
      const index = this.lotes.findIndex(l => l.id === this.newLote.id);
      if (index !== -1) {
        this.lotes[index] = { ...this.newLote };
      }
    } else {
      this.newLote.id = this.lotes.length > 0 ? Math.max(...this.lotes.map(l => l.id)) + 1 : 101;
      this.lotes.push({ ...this.newLote });
    }
    this.toggleForm();
  }

  editLote(id: number) {
    const lote = this.lotes.find(l => l.id === id);
    if (lote) {
      this.newLote = { ...lote };
      this.showForm = true;
    }
  }

  deleteLote(id: number) {
    this.lotes = this.lotes.filter(l => l.id !== id);
  }

  openStockModal(id: number) {
    this.stockToAdd = 0;
    this.newLote.id = id;
    this.showStockModal = true;
  }

  confirmAddStock() {
    const lote = this.lotes.find(l => l.id === this.newLote.id);
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
    return lote.id; // Usa el ID del lote para evitar errores y mejorar rendimiento
  }
}