import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-boleta-salida',
  standalone: true,
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
  nuevaBoletaSalida: BoletaSalida = { id_boleta: 0, id_lote: 0, id_personal: 0, lote_info: '', nombre_personal: '', fecha: '' };

  constructor(
    private toastr: ToastrService,
    private pesonalServices: PersonalService,
    private loteServices: LoteService,
    private boleta_salidaServices: BoletaSalidaService,
    private _bitacoraservices: BitacoraService,
  ) { }

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
    this.nuevaBoletaSalida = { id_boleta: 0, id_lote: 0, id_personal: 0, lote_info: '', nombre_personal: '', fecha: '' };
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
        this._bitacoraservices.ActualizarBitacora("Agregó un nueva Boleta de salida del lote: " + this.nuevaBoletaSalida.id_lote + " -- " + "para el personal con ID: " + this.nuevaBoletaSalida.id_personal);
        this.cerrarModal();
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail || e.error?.message || 'Error al insertar';
        this.toastr.error(errorMessage, "Error");
      }
    });
  }

  eliminarBoleta_Salida(id: number, personal: String) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.boleta_salidaServices.deleteBoleta_Salida(id).subscribe({
          next: (response: any) => {
            this.toastr.warning('Boleta de salida eliminada correctamente.', 'Éxito');
            this.getBoleta_salidaServices();
            this._bitacoraservices.ActualizarBitacora("Eliminó una Boleta de salida con ID : " + id + " -- " + "del personal: " + personal);
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

  // parte de reporte de boleta de salida.....................
  // Modal
  public modalSalidas = signal<boolean>(false);
  public mostrarModalSalida() {
    this.reiniciarFiltrosSalida();
    this.salidaFiltrada.set(this.boleta_salidaList);
    this.modalSalidas.set(true);
  }

  public cerrarModalSalida() {
    this.modalSalidas.set(false);
  }

  // Columnas disponibles
  public columnasDisponiblesSalida = signal<{ clave: string, nombre: string, seleccionado: boolean }[]>([
    { clave: 'id_boleta', nombre: 'ID', seleccionado: false },
    { clave: 'lote_info', nombre: 'Información de Lote', seleccionado: false },
    { clave: 'nombre_personal', nombre: 'Personal', seleccionado: false },
    { clave: 'fecha', nombre: 'Fecha', seleccionado: false }
  ]);
  public columnasSeleccionadasSalida() {
    return this.columnasDisponiblesSalida().filter(c => c.seleccionado);
  }

  // Lista filtrada
  public salidaFiltrada = signal<BoletaSalida[]>([]);

  // Filtros
  public fechaInicioSalida = signal<string>('');
  public fechaFinSalida = signal<string>('');
  public personalFiltroSalida = signal<string>('');
  public loteFiltroSalida = signal<string>('');

  // Formato seleccionado
  public formatoSeleccionadoSalida = signal<string>('pdf');

  // Reiniciar filtros y columnas
  public reiniciarFiltrosSalida() {
    this.columnasDisponiblesSalida.set([
      { clave: 'id_boleta', nombre: 'ID', seleccionado: false },
      { clave: 'lote_info', nombre: 'Información de Lote', seleccionado: false },
      { clave: 'nombre_personal', nombre: 'Personal', seleccionado: false },
      { clave: 'fecha', nombre: 'Fecha', seleccionado: false }
    ]);

    this.fechaInicioSalida.set('');
    this.fechaFinSalida.set('');
    this.personalFiltroSalida.set('');
    this.loteFiltroSalida.set('');
    this.salidaFiltrada.set(this.boleta_salidaList);
  }

  // Aplicar filtros activos
  public actualizarFiltradoSalida() {
    const salidasFiltradas = this.boleta_salidaList.filter(salida => {
      const fechaSalida = new Date(salida.fecha ?? '');

      const cumpleFecha = (() => {
        if (this.fechaInicioSalida() || this.fechaFinSalida()) {
          const inicio = this.fechaInicioSalida() ? new Date(this.fechaInicioSalida() + 'T00:00:00') : null;
          const fin = this.fechaFinSalida() ? new Date(this.fechaFinSalida() + 'T23:59:59') : null;
          return (inicio ? fechaSalida >= inicio : true) && (fin ? fechaSalida <= fin : true);
        }
        return true;
      })();

      const cumplePersonal = (() => {
        const filtro = this.personalFiltroSalida();
        return filtro !== ''
          ? salida.nombre_personal?.toLowerCase().trim() === filtro.toLowerCase().trim()
          : true;
      })();

      const cumpleLote = (() => {
        const filtro = this.loteFiltroSalida();
        return filtro !== ''
          ? salida.lote_info?.toLowerCase().trim() === filtro.toLowerCase().trim()
          : true;
      })();

      return cumpleFecha && cumplePersonal && cumpleLote;
    });
    this.salidaFiltrada.set(salidasFiltradas);
  }

  // Obtener valor dinámico
  public obtenerValorSalida(row: BoletaSalida, clave: string): any {
    const mapa: Record<string, () => any> = {
      id_boleta: () => row.id_boleta,
      lote_info: () => row.lote_info,
      nombre_personal: () => row.nombre_personal,
      fecha: () => row.fecha
    };
    return mapa[clave]?.() ?? 'Sin datos';
  }

  // Ejecutar exportación según formato
  public generarReporteSalida() {
    console.log(`Generando reporte de salidas en: ${this.formatoSeleccionadoSalida()}`);
    switch (this.formatoSeleccionadoSalida()) {
      case 'pdf': this.generarPDFSalidas(); break;
      case 'excel': this.generarExcelSalidas(); break;
      case 'html': this.generarHTMLSalidas(); break;
      default: console.warn("Formato no válido");
    }
  }

  public generarPDFSalidas() {
    const doc = new jsPDF();

    // Logo
    const logoBase64 = 'assets/tiendalogo.png';
    const logoWidth = 30;
    const originalWidth = 100;
    const originalHeight = 50;
    const aspectRatio = originalHeight / originalWidth;
    const logoHeight = logoWidth * aspectRatio;

    doc.addImage(logoBase64, 'PNG', 160, 10, logoWidth, logoHeight);

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Reporte de Boletas de Salida', 10, 20);

    // Preparar datos
    const columnasActivas = this.columnasSeleccionadasSalida().map(col => col.nombre);
    const filas = this.salidaFiltrada().map(row =>
      this.columnasSeleccionadasSalida().map(col =>
        this.obtenerValorSalida(row, col.clave))
    );

    // Tabla
    autoTable(doc, {
      head: [columnasActivas],
      body: filas,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 10
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

    // Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.line(10, pageHeight - 30, doc.internal.pageSize.width - 10, pageHeight - 30);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Generado por: Sistema de Gestión de Boletas de Salida', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });
    doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, doc.internal.pageSize.width / 2, pageHeight - 15, { align: 'center' });

    // Guardar
    doc.save(`reporte-salidas-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  public generarExcelSalidas() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Salidas');

    // Columnas seleccionadas
    const columnasActivas = this.columnasSeleccionadasSalida().map(col => ({
      header: col.nombre,
      key: col.clave,
      width: 20
    }));

    worksheet.columns = columnasActivas;

    // Título
    const totalColumnas = columnasActivas.length;
    const tituloRango = `A1:${String.fromCharCode(65 + totalColumnas - 1)}1`;
    worksheet.mergeCells(tituloRango);
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = '📤 Reporte de Boletas de Salida';
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 25;

    worksheet.addRow([]);

    // Info del reporte
    const infoReporte = [
      ['Fecha de generación:', new Date().toLocaleString()],
      ['Total boletas en reporte:', this.salidaFiltrada().length]
    ];
    infoReporte.forEach(info => {
      const row = worksheet.addRow(info);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'right' : 'left' };
        if (colNumber === 1) cell.font = { bold: true };
      });
    });

    worksheet.addRow([]);

    // Títulos de tabla
    const tableTitles = columnasActivas.map(c => c.header);
    const titlesRow = worksheet.addRow(tableTitles);
    titlesRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007ACC' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Datos con alternancia de colores
    let isGray = true;
    this.salidaFiltrada().forEach(row => {
      const fila = columnasActivas.map(col => this.obtenerValorSalida(row, col.key) ?? 'Sin datos');
      const dataRow = worksheet.addRow(fila);
      const rowColor = isGray ? 'FFD3D3D3' : 'FFFFFFFF';
      dataRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      isGray = !isGray;
    });

    // Guardar archivo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `reporte-salidas-${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  }

  public generarHTMLSalidas() {
    console.log("Generando reporte de salidas en HTML...");

    let contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Salidas</title>
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
      <div class="titulo">📤 Reporte de Boletas de Salida</div>
      <div class="info-reporte">
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total boletas en reporte:</strong> ${this.salidaFiltrada().length}</p>
      </div>
      <table>
        <thead>
          <tr>${this.columnasSeleccionadasSalida().map(col => `<th>${col.nombre}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${this.salidaFiltrada().map((row, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F2F2F2'};">
              ${this.columnasSeleccionadasSalida().map(col => `<td>${this.obtenerValorSalida(row, col.clave) ?? "Sin datos"}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

    const blob = new Blob([contenidoHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-salidas-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}