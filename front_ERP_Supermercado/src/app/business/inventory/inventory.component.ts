import { Component, OnInit, computed, Signal, ChangeDetectorRef, signal, inject } from '@angular/core';
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
import { BitacoraService } from '../../../services/bitacora.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver'

import { AppComponent } from '../../app.component';
import { Encargado } from '../../../interface/encargado.interface';
import { EncargadoService } from '../../../services/encargado.service';
import { ForumlarioRegisterEncargadoComponent } from "./forumlario-register-encargado/forumlario-register-encargado.component";
import { FormularioAsignacionEncargadoComponent } from "./formulario-asignacion-encargado/formulario-asignacion-encargado.component";

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule, ForumlarioRegisterEncargadoComponent, FormularioAsignacionEncargadoComponent],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export default class InventoryComponent implements OnInit {
  private encargadoService = inject(EncargadoService)
  constructor(
    private toastr: ToastrService,
    private loteServices: LoteService,
    private productoServices: ProductoService,
    private repisaServices: RepisaService,
    private alamcenServices: AlmacenService,
    private _bitacoraservices: BitacoraService,
    private cdRef: ChangeDetectorRef,
    private appComponent: AppComponent
  ) { }

  estadoModalRegisterEncargado = computed(() => this.encargadoService.modalRegister());
  estadoModalEnviarNotificacion=computed(()=>this.encargadoService.modalEnviar());
  listaEncargados = signal<Encargado[]>([]);


  abrirModal() {
    this.encargadoService.cambiarEstadoModal();
  }

  abrirModalEnviar(){
     this.encargadoService.cambiarEstadoModalEnviar();
  }

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
    this.lotesFiltrados.set(data);
    this.appComponent.alertasStock = data.filter(p => p.stock <= p.stock_minimo);
  });
}

  getRepisas() {
    this.repisaServices.getRepisas().subscribe((data) => {
      this.Repisas = data;
    })
  }

  getAlmacenes() {
    this.alamcenServices.getAlmacenes().subscribe((data) => {
      this.Almacenes = data;
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
          next: (response: any) => {
            this.toastr.success('Lote Actualizado correctamente.', 'Éxito');
            this.getLotes();
            this._bitacoraservices.ActualizarBitacora("Actualizó un Lote con ID y producto: " + this.newLote.id_lote + " -- " + this.newLote.descripcion_producto);
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
        next: (response: any) => {
          this.toastr.success('Lote Insertado correctamente.', 'Éxito');
          this.getLotes();
          this._bitacoraservices.ActualizarBitacora("Agregó un nuevo Lote del producto: " + this.newLote.descripcion_producto);
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

  deleteLote(lote: Lote) {
    this.loteServices.deleteLote(lote.id_lote!).subscribe({
      next: (response: any) => {
        this.toastr.success('Lote Eliminado correctamente.', 'Éxito');
        this.getLotes();
        this._bitacoraservices.ActualizarBitacora("Elimino Lote con ID del producto: " + lote.id_lote + " -- " + lote.descripcion_producto);
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

  //PARTE DE REPORTE DE INVENTARIO..................
  // Estado del modal para elegir columnas**
  public modalInventario = signal<boolean>(false);

  // Lista de columnas disponibles para el reporte**
  public columnasDisponibles = signal<{ clave: string, nombre: string, seleccionado: boolean }[]>([
    { clave: 'id_lote', nombre: 'ID Lote', seleccionado: false },
    { clave: 'descripcion_producto', nombre: 'Producto', seleccionado: false },
    { clave: 'stock', nombre: 'Stock', seleccionado: false },
    { clave: 'stock_minimo', nombre: 'Stock Mínimo', seleccionado: false },
    { clave: 'fecha_caducidad', nombre: 'Fecha de Caducidad', seleccionado: false },
    { clave: 'costo_unitario', nombre: 'Costo Unitario', seleccionado: false },
    { clave: 'cod_repisa', nombre: 'Cod. Repisa', seleccionado: false },
    { clave: 'cod_almacen', nombre: 'Cod. Almacén', seleccionado: false },
    { clave: 'nombre_estado', nombre: 'Estado', seleccionado: false }
  ]);

  // Filtros para el reporte**
  public almacenSeleccionado = signal<string>("");
  public repisaSeleccionada = signal<string>("");
  public fechaCaducidadSeleccionada = signal<string>("");
  public stockSeleccionado = signal<string>("");
  public lotesFiltrados = signal<Lote[]>([]);
  public estadoSeleccionado = signal<string>("");

  // Formato de exportación**
  public formatoSeleccionado = signal<string>("pdf");

  // Abrir el modal**
  public mostrarModalInventario() {
    console.log("Mostrando modal de reporte de inventario...");
    this.modalInventario.set(true);
    this.cdRef.detectChanges();
  }

  // Cerrar el modal**
  public cerrarModalInventario() {
    console.log("Cerrando modal y guardando selección...");
    this.modalInventario.set(false);
    this.cdRef.detectChanges();
  }

  // Generar el reporte en el formato seleccionado**
  public generarReporte() {
    console.log(`Generando reporte en formato: ${this.formatoSeleccionado()}`);

    switch (this.formatoSeleccionado()) {
      case "pdf":
        this.generarPDF();
        break;
      case "excel":
        this.generarExcel();
        break;
      case "html":
        this.generarHTML();
        break;
      default:
        console.warn("Formato de reporte no válido.");
    }
  }

  public columnasSeleccionadas() {
    return this.columnasDisponibles().filter(c => c.seleccionado);
  }

  public obtenerValor(row: Lote, clave: string): any {
    return row[clave as keyof Lote] ?? 'Sin datos';
  }

  // Variables para el rango de fechas
  public fechaInicio = signal<string>("");
  public fechaFin = signal<string>("");

  // Aplicar todos los filtros sobre `lotesFiltrados`**
  public actualizarFiltros() {
    const lotesFiltrados = this.lotes.filter(lote => {
      const cumpleAlmacen = this.almacenSeleccionado() ? lote.cod_almacen === this.almacenSeleccionado() : true;
      const cumpleRepisa = this.repisaSeleccionada() ? lote.cod_repisa === this.repisaSeleccionada() : true;
      const cumpleStock = (() => {
        if (this.stockSeleccionado() === "critico") {
          return lote.stock < lote.stock_minimo;
        } else if (this.stockSeleccionado() === "suficiente") {
          return lote.stock >= lote.stock_minimo;
        }
        return true;
      })();
      const cumpleEstado = (() => {
        if (this.estadoSeleccionado()) {
          return lote.nombre_estado.toLowerCase() === this.estadoSeleccionado().toLowerCase();
        }
        return true;
      })();
      const cumpleFecha = (() => {
        if (this.fechaInicio() || this.fechaFin()) {
          if (!lote.fecha_caducidad) return false;
          const fechaLote = new Date(lote.fecha_caducidad);
          const inicio = this.fechaInicio() ? new Date(this.fechaInicio() + "T00:00:00") : null;
          const fin = this.fechaFin() ? new Date(this.fechaFin() + "T23:59:59") : null;
          return (inicio ? fechaLote >= inicio : true) && (fin ? fechaLote <= fin : true);
        }
        return true;
      })();

      return cumpleAlmacen && cumpleRepisa && cumpleStock && cumpleEstado && cumpleFecha;
    });

    this.lotesFiltrados.set(lotesFiltrados);
  }

  // Funciones para exportar (próximamente se implementarán)**
  public generarPDF() {
    const doc = new jsPDF();

    // Logo y Encabezado
    const logoBase64 = 'assets/tiendalogo.png';
    const logoWidth = 30;
    const originalWidth = 100;
    const originalHeight = 50;
    const aspectRatio = originalHeight / originalWidth;
    const logoHeight = logoWidth * aspectRatio;
    doc.addImage(logoBase64, 'PNG', 160, 10, logoWidth, logoHeight);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Reporte de Inventario', 10, 20);

    // Filtrar columnas activas
    const columnasActivas = this.columnasSeleccionadas().map(col => col.nombre);
    const filas = this.lotesFiltrados().map(row =>
      this.columnasSeleccionadas().map(col => this.obtenerValor(row, col.clave))
    );

    // Tabla con solo las columnas activas
    autoTable(doc, {
      head: [columnasActivas], // Solo columnas seleccionadas
      body: filas, // Solo datos de esas columnas
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 10 // 📌 Reducimos el tamaño de la letra en los títulos
      },
      styles: {
        fontSize: 9,
        textColor: [33, 33, 33],
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
        fillColor: [240, 240, 240]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 10, right: 10 }
    });

    // Pie de Página
    const pageHeight = doc.internal.pageSize.height;

    doc.setDrawColor(200, 200, 200);
    doc.line(10, pageHeight - 30, doc.internal.pageSize.width - 10, pageHeight - 30);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Generado por: Sistema de Gestión de Inventario', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });
    doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, doc.internal.pageSize.width / 2, pageHeight - 15, { align: 'center' });

    // Guardar el PDF
    doc.save('reporte-inventario.pdf');
  }
  
  public generarExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Inventario');

    // Encabezados de la Tabla
    const columnasActivas = this.columnasSeleccionadas().map(col => ({
      header: col.nombre,
      key: col.clave,
      width: 20
    }));

    worksheet.columns = columnasActivas;

    // Ubicar el Título (Ajustado al número exacto de columnas)
    const totalColumnas = columnasActivas.length;
    const tituloRango = `A1:${String.fromCharCode(65 + totalColumnas - 1)}1`; 
    worksheet.mergeCells(tituloRango);
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = '📊 Reporte de Inventario';
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 25;

    worksheet.addRow([]);

    // Información del Reporte
    const infoReporte = [
      ['Fecha de generación:', new Date().toLocaleString()],
      ['Total lotes en reporte:', this.lotesFiltrados().length]
    ];
    infoReporte.forEach(info => {
      const row = worksheet.addRow(info);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'right' : 'left' };
        if (colNumber === 1) {
          cell.font = { bold: true };
        }
      });
    });

    worksheet.addRow([]);

    // Aplicar ajustes de ancho automático a cada columna
    worksheet.columns.forEach(column => {
      column.width = 25;
    });

    // Encabezados de la Tabla
    const tableTitles = columnasActivas.map(c => c.header);
    const titlesRow = worksheet.addRow(tableTitles);
    titlesRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007ACC' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Llenar los Datos con Alternancia de Colores
    let isGray = true;
    this.lotesFiltrados().forEach(lote => {
      const fila = columnasActivas.map(col => lote[col.key as keyof Lote] ?? "Sin datos");
      const dataRow = worksheet.addRow(fila);

      // Alternar colores en filas
      const rowColor = isGray ? 'FFD3D3D3' : 'FFFFFFFF';
      dataRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      isGray = !isGray;
    });

    // Guardar el archivo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte-inventario.xlsx');
    });
  }

  public generarHTML() {
    console.log("Generando reporte en HTML...");

    // Generar el contenido HTML
    let contenidoHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte de Inventario</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .titulo { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; }
                .info-reporte { margin-bottom: 20px; font-size: 16px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
                th { background-color: #007ACC; color: white; font-size: 14px; }
                tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <div class="titulo">📊 Reporte de Inventario</div>
            <div class="info-reporte">
                <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Total lotes en reporte:</strong> ${this.lotesFiltrados().length}</p>
            </div>
            <table>
                <thead>
                    <tr>${this.columnasSeleccionadas().map(col => `<th>${col.nombre}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${this.lotesFiltrados().map((lote, index) => `
                        <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F2F2F2'};">
                            ${this.columnasSeleccionadas().map(col => `<td>${lote[col.clave as keyof Lote] ?? "Sin datos"}</td>`).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Crear un archivo HTML y descargarlo
    const blob = new Blob([contenidoHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reporte-inventario.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}