import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { MetodoPagoService } from '../../../services/metodoPago.service';
import { ProductoService } from '../../../services/producto.service';
import { ComprasService } from '../../../services/compras.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DetalleBoletaService } from '../../../services/detalleBoleta.service';
import { Router } from '@angular/router';
import BoletaCompraComponent from "../boletaCompra/boletaCompra.component";
import { BoletaCompra, DetalleCompra } from '../../../interface/compras.interface';
import { BitacoraService } from '../../../services/bitacora.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-compras-page',
  standalone: true,
  imports: [BoletaCompraComponent, FormsModule, CommonModule],
  templateUrl: './compras-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComprasPageComponent {
  //injecciones
  private proveedorService = inject(ProveedorService);//aqui vamos a llamar al metodo pago
  private metodoPagoService = inject(MetodoPagoService);
  private productoService = inject(ProductoService);
  public boletaCompraService = inject(ComprasService);
  private toastr = inject(ToastrService);
  private detalleBoletaService = inject(DetalleBoletaService);
  private router = inject(Router);
  private detalleService = inject(DetalleBoletaService);
  private bitacoraService = inject(BitacoraService);


  //propiedades para manejar los formularios

  //registrar
  idBoleta = signal<number>(0);
  costoTotal = signal<string>('');
  fecha = signal<string>('');
  idProveedor = signal<number>(0);
  idMetodoPago = signal<number>(0);
  estado = signal<string>('Completado');
  //registrar detalle de compra
  cantidad = signal<string>('');
  costoUnitario = signal<string>('');
  idProducto = signal<number>(0);

  listaDetalles = signal<any[]>([]);

  //editar detalle de compra
  cantidadActualizado = signal<string>('');
  costoUnitarioActualizado = signal<string>('');
  idProductoActualizado = signal<string>('');

  nombreProducto = signal<string>('');

  //proveedor
  listaProveedor = computed(() => this.proveedorService.listaProveedor());
  //metodo pago
  listaMetodoPago = computed(() => this.metodoPagoService.listaMetodoPago());
  //productos
  listaProductos = computed(() => this.productoService.listaProductos());
  //boleta de compras
  listaBoletaCompras = computed(() => this.boletaCompraService.listaBoletaCompra());

  //para agregar detalles de productos
  //lista para mostrar los detalles de los productos
  //lista para mostrar las compras realizadas

  buscarProveedor(id: number) {
    const proveedor = this.listaProveedor().find((proveedor) => proveedor.idProveedor == id);
    return proveedor?.nombre;
  }
  buscarMetodo(id: number) {
    const metodo = this.listaMetodoPago().find((metodo) => metodo.metodoPagoId == id);
    return metodo?.nombre;
  }
  buscarProducto(id: number) {
    const producto = this.listaProductos().find((producto) => producto.idProducto == id);
    return producto?.descripcion;
  }

  buscarProductoNombre(nombre: string) {
    const producto = this.listaProductos().find((producto) => producto.descripcion == nombre);
    console.log(producto?.idProducto);
    return producto?.idProducto;
  }

  asignarProducto(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idProducto.set(+valor);
    console.log(valor);
  }

  asignarProveedor(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idProveedor.set(+valor);
    console.log(valor);
  }
  asignarMetodoPago(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idMetodoPago.set(+valor);
    console.log(valor);
  }

  fechaFormateado(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses: 0-11
    const day = String(date.getDate()).padStart(2, '0');

    const formateado = `${year}-${month}-${day}`;
    this.fecha.set(formateado);
  }


  registrarBoletaCompra() {
    const costoTotal = +this.costoTotal();
    const fecha = this.fecha();
    const idProveedor = this.idProveedor();
    const idMetodo = this.idMetodoPago();
    const estado = this.estado();
    this.boletaCompraService.registrarBoletaCompra(costoTotal, fecha, idProveedor, idMetodo, estado).subscribe({
      next: (resp: any) => {
        this.idBoleta.set(resp.idBoletaCompra);
        console.log(resp);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La boleta fue regisrada pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar la boleta: " + errorMessage, 'Error');
        }
      }
    });
    this.bitacoraService.ActualizarBitacora(`Registro una boleta de compra del proveedor con id: ${idProveedor}`);
  }

  eliminarBoletaCompra(boleta: BoletaCompra) {
    console.log(boleta);
    const id = boleta.idBoletaCompra;
    this.boletaCompraService.editarBoletaCompra(id, boleta.idBoletaCompra, boleta.costoTotal, boleta.fecha, boleta.idProveedor, boleta.idMetodoPago, 'Eliminado').subscribe(
      (response) => {
        this.toastr.success("Eliminado exitosamente");
      }
    )
    this.bitacoraService.ActualizarBitacora(`Elimino la boleta de compra con id: ${boleta.idBoletaCompra}`);
  }

  agregarDetalleProducto() {
    const idBoleta = this.idBoleta();
    const cantidad = this.cantidad();
    const costoUnitario = this.costoUnitario();
    const idProducto = this.idProducto();
    const detalle = {
      cantidad: cantidad,
      costoUnitario: costoUnitario,
      idBoleta: idBoleta,
      idProducto: idProducto
    }
    this.listaDetalles.update((actual) => [...actual, detalle]);
    console.log(this.listaDetalles());
  }
  //actualizar detalle
  editarDetalleBoleta() {
    const idProductoActualizado = this.buscarProductoNombre(this.nombreProducto());
    const cantidadActualizado = +this.cantidadActualizado();
    const costoUnitarioActualizado = +this.costoUnitarioActualizado(); 0

    console.log(idProductoActualizado);
    console.log(cantidadActualizado);
    console.log(costoUnitarioActualizado);
    this.listaDetalles.update(detalles =>
      detalles.map(detalle => {
        if (detalle.idProducto === idProductoActualizado) {
          return {
            ...detalle,
            cantidad: cantidadActualizado,
            costoUnitario: costoUnitarioActualizado,
            idProducto: idProductoActualizado
          }
        }
        return detalle;
      })
    )
    console.log(this.listaDetalles());
  }

  eliminarDetalle(id: number) {
    this.listaDetalles.update(detalles =>
      detalles.filter(detalle => detalle.idProducto != id)
    )
  }

  registrarDetalleBoleta() {
    console.log('entra');
    console.log(this.listaDetalles());
    this.listaDetalles().forEach((detalle) => {
      console.log(detalle);
      this.bitacoraService.ActualizarBitacora(`Adiciono el producto con id: ${detalle.idProducto} a la boleta de compra`);
      this.detalleBoletaService.registrarDetalleBoletaCompra(detalle.cantidad, detalle.costoUnitario, detalle.idBoleta, detalle.idProducto);
    });
    this.listaDetalles.set([]);
    this.fecha.set('');
    this.idProveedor.set(0);
    this.idMetodoPago.set(0);
    this.cantidad.set('');
    this.costoUnitario.set('');
    this.idProducto.set(0);
  }

  verBoletaCompra(boleta: BoletaCompra) {
    this.boletaCompraService.boletaCompraActual.set(boleta);
    this.detalleService.obtenerDetallesBoletaCompra(boleta.idBoletaCompra).subscribe(
      (response: DetalleCompra[]) => {
        this.boletaCompraService.listaDetalleActual.set(response);
      }
    )
    this.boletaCompraService.verBoletaSwitch();

  }

  ngOnInit() {
    this.metodoPagoService.getMetodoPagos();
    this.proveedorService.obtenerListaProveedores();
    this.productoService.obtenerProductos();
    this.boletaCompraService.getBoletaCompras();
  }

  // ----------parte de reporte de compras............................................
  // Modal
  public modalCompras = signal<boolean>(false);
  public mostrarModalCompras() {
    this.reiniciarFiltrosCompras();
    this.comprasFiltradas.set(this.listaBoletaCompras());
    this.modalCompras.set(true);
  }
  public cerrarModalCompras() {
    this.modalCompras.set(false);
  }

  // Columnas
  public columnasDisponiblesCompras = signal<{ clave: string, nombre: string, seleccionado: boolean }[]>([
    { clave: 'idBoletaCompra', nombre: 'ID', seleccionado: false },
    { clave: 'fecha', nombre: 'Fecha', seleccionado: false },
    { clave: 'proveedor', nombre: 'Proveedor', seleccionado: false },
    { clave: 'costoTotal', nombre: 'Total (Bs)', seleccionado: false },
    { clave: 'metodo', nombre: 'Método de Pago', seleccionado: false },
    { clave: 'estado', nombre: 'Estado', seleccionado: false }
  ]);

  public columnasSeleccionadasCompras() {
    return this.columnasDisponiblesCompras().filter(c => c.seleccionado);
  }

  // Lista filtrada
  public comprasFiltradas = signal<any[]>([]);

  // Filtros
  public fechaInicioCompra = signal<string>('');
  public fechaFinCompra = signal<string>('');
  public proveedorFiltro = signal<string>('');
  public metodoPagoFiltro = signal<string>('');
  public estadoCompraFiltro = signal<string>('');
  public costoMin = signal<string>('');
  public costoMax = signal<string>('');

  // Formato seleccionado
  public formatoSeleccionadoCompra = signal<string>('pdf');

  // Reiniciar filtros
  public reiniciarFiltrosCompras() {
    this.columnasDisponiblesCompras.set([
      { clave: 'idBoletaCompra', nombre: 'ID', seleccionado: false },
      { clave: 'fecha', nombre: 'Fecha', seleccionado: false },
      { clave: 'proveedor', nombre: 'Proveedor', seleccionado: false },
      { clave: 'costoTotal', nombre: 'Total (Bs)', seleccionado: false },
      { clave: 'metodo', nombre: 'Método de Pago', seleccionado: false },
      { clave: 'estado', nombre: 'Estado', seleccionado: false }
    ]);

    this.fechaInicioCompra.set('');
    this.fechaFinCompra.set('');
    this.proveedorFiltro.set('');
    this.metodoPagoFiltro.set('');
    this.estadoCompraFiltro.set('');
    this.costoMin.set('');
    this.costoMax.set('');
    this.comprasFiltradas.set(this.listaBoletaCompras());
  }

  // Aplicar filtros
  public actualizarFiltradoCompras() {
    const comprasFiltradas = this.listaBoletaCompras().filter(compra => {
      const fechaCompra = new Date(compra.fecha ?? '');

      const cumpleFecha = (() => {
        const inicio = this.fechaInicioCompra() ? new Date(this.fechaInicioCompra() + 'T00:00:00') : null;
        const fin = this.fechaFinCompra() ? new Date(this.fechaFinCompra() + 'T23:59:59') : null;
        return (inicio ? fechaCompra >= inicio : true) && (fin ? fechaCompra <= fin : true);
      })();

      const cumpleProveedor = (() => {
        const filtro = this.proveedorFiltro();
        const nombre = this.buscarProveedor(compra.idProveedor)?.toLowerCase().trim();
        return filtro !== ''
          ? nombre === filtro.toLowerCase().trim()
          : true;
      })();

      const cumpleMetodo = (() => {
        const filtro = this.metodoPagoFiltro();
        const metodo = this.buscarMetodo(compra.idMetodoPago)?.toLowerCase().trim();
        return filtro !== ''
          ? metodo === filtro.toLowerCase().trim()
          : true;
      })();

      const cumpleEstado = (() => {
        const filtro = this.estadoCompraFiltro();
        return filtro !== ''
          ? compra.estado?.toLowerCase().trim() === filtro.toLowerCase().trim()
          : true;
      })();

      const cumpleCosto = (() => {
        const total = +compra.costoTotal;
        const min = this.costoMin() ? +this.costoMin() : -Infinity;
        const max = this.costoMax() ? +this.costoMax() : Infinity;
        return total >= min && total <= max;
      })();

      return cumpleFecha && cumpleProveedor && cumpleMetodo && cumpleEstado && cumpleCosto;
    });

    this.comprasFiltradas.set(comprasFiltradas);
  }

  // Obtener valor dinámico
  public obtenerValorCompra(row: any, clave: string): any {
    const mapa: Record<string, () => any> = {
      idBoletaCompra: () => row.idBoletaCompra,
      fecha: () => row.fecha,
      proveedor: () => this.buscarProveedor(row.idProveedor),
      costoTotal: () => row.costoTotal,
      metodo: () => this.buscarMetodo(row.idMetodoPago),
      estado: () => row.estado
    };
    return mapa[clave]?.() ?? 'Sin datos';
  }

  // Generar reporte según formato elegido
  public generarReporteCompras() {
    console.log(`Generando reporte de compras en: ${this.formatoSeleccionadoCompra()}`);
    switch (this.formatoSeleccionadoCompra()) {
      case 'pdf':
        this.generarPDFCompras(); // ya lo tienes
        break;
      case 'excel':
        this.generarExcelCompras(); // lo armamos luego si quieres
        break;
      case 'html':
        this.generarHTMLCompras(); // mismo diseño adaptado
        break;
      default:
        console.warn('Formato no válido');
    }
  }

  public generarPDFCompras() {
    const doc = new jsPDF();

    // Logo y encabezado
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
    doc.text('Reporte de Compras', 10, 20);

    // Filtrar columnas activas y construir filas
    const columnasActivas = this.columnasSeleccionadasCompras().map(col => col.nombre);
    const filas = this.comprasFiltradas().map(row =>
      this.columnasSeleccionadasCompras().map(col => this.obtenerValorCompra(row, col.clave))
    );

    // Dibujar tabla
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
    doc.text('Generado por: Sistema ERP - Módulo de Compras', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });
    doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, doc.internal.pageSize.width / 2, pageHeight - 15, { align: 'center' });

    // Guardar
    doc.save('reporte-compras.pdf');
  }

  public generarExcelCompras() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Compras');

    // Columnas activas
    const columnasActivas = this.columnasSeleccionadasCompras().map(col => ({
      header: col.nombre,
      key: col.clave,
      width: 20
    }));
    worksheet.columns = columnasActivas;

    // Título centrado
    const totalColumnas = columnasActivas.length;
    const tituloRango = `A1:${String.fromCharCode(65 + totalColumnas - 1)}1`;
    worksheet.mergeCells(tituloRango);
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = '🧾 Reporte de Compras';
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 25;

    worksheet.addRow([]);

    // Información del reporte
    const infoReporte = [
      ['Fecha de generación:', new Date().toLocaleString()],
      ['Total compras en reporte:', this.comprasFiltradas().length]
    ];
    infoReporte.forEach(info => {
      const row = worksheet.addRow(info);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'right' : 'left' };
        if (colNumber === 1) cell.font = { bold: true };
      });
    });

    worksheet.addRow([]);

    // Ajustar ancho
    worksheet.columns.forEach(column => {
      column.width = 25;
    });

    // Encabezados
    const tableTitles = columnasActivas.map(c => c.header);
    const titlesRow = worksheet.addRow(tableTitles);
    titlesRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007ACC' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Cuerpo con alternancia
    let isGray = true;
    this.comprasFiltradas().forEach(compra => {
      const fila = columnasActivas.map(col => this.obtenerValorCompra(compra, col.key ?? '') ?? "Sin datos");
      const dataRow = worksheet.addRow(fila);

      const rowColor = isGray ? 'FFD3D3D3' : 'FFFFFFFF';
      dataRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      isGray = !isGray;
    });

    // Descargar
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte-compras.xlsx');
    });
  }

  public generarHTMLCompras() {
    console.log("Generando reporte en HTML...");

    const columnas = this.columnasSeleccionadasCompras();
    const filas = this.comprasFiltradas();

    let contenidoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Compras</title>
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
      <div class="titulo">📄 Reporte de Compras</div>
      <div class="info-reporte">
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total compras en reporte:</strong> ${filas.length}</p>
      </div>
      <table>
        <thead>
          <tr>${columnas.map(col => `<th>${col.nombre}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${filas.map((compra, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F2F2F2'};">
              ${columnas.map(col => `<td>${this.obtenerValorCompra(compra, col.clave)}</td>`).join("")}
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
    link.download = "reporte-compras.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}