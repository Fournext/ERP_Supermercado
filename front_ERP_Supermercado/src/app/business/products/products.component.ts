import { ChangeDetectorRef, Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductoService } from '../../../services/producto.service';
import { ImagenService } from '../../../services/imagen.service';
import { MarcaService } from '../../../services/marca.service';
import { CategoriaService } from '../../../services/categoria.service';
import { ProductoConPrecio } from '../../../interface/producto.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BitacoraService } from '../../../services/bitacora.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export default class ProductsComponent {
  private productoService = inject(ProductoService);
  private imagenService = inject(ImagenService);
  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);
  private toastr = inject(ToastrService);
  private _bitacoraservices = inject(BitacoraService);

  public listaProductos = computed(() => this.productoService.listaProductos());
  public listaImagenes = computed(() => this.imagenService.listaImagenes());
  public listaMarcas = computed(() => this.marcaService.listaMarcas());
  public listaCategorias = computed(() => this.categoriaService.listaCategorias());

  public switchFormularioCrear = signal<boolean>(false);
  public switchFormularioActualizar = signal<boolean>(false);

  public filtroNombre = signal<string>('');
  public filtroCategoria = signal<string>('');
  public filtroCodigo = signal<string>('');

  public productosFiltrados = computed(() => {
    return this.listaProductos().filter(producto =>
      producto.codigo.toLowerCase().includes(this.filtroCodigo().toLowerCase()) &&
      producto.descripcion.toLowerCase().includes(this.filtroNombre().toLowerCase()) &&
      (this.categoriaSeleccionada() === "" || producto.categoria === this.categoriaSeleccionada()) &&
      (this.marcaSeleccionada() === "" || producto.marca === this.marcaSeleccionada()) &&
      (this.tipoProductoSeleccionado() === "" || producto.tipo_producto === this.tipoProductoSeleccionado())
    ).map(producto => ({
      ...producto,
      imagenUrl: this.buscarUrl(producto.idProducto) || 'assets/default-image.jpg'
    }));
  });

  public trackProductos(index: number, producto: any): number {
    return producto.idProducto;
  }

  // En el componente TypeScript
  public listaProductosConImagen = computed(() => {
    return this.productoService.listaProductos().map(producto => {
      const imagen = this.listaImagenes().find((imagenActual) => imagenActual.idProducto == producto.idProducto);
      return {
        ...producto,
        imagenUrl: imagen ? imagen.url : ''
      };
    });
  });

  //atributos para crear
  public codigo = signal<string>('');
  public descripcion = signal<string>('');
  public marca = signal<string>('');
  public categoria = signal<string>('');
  public tipoProducto = signal<string>('');
  public precio = signal<string>('');
  //atributos para actualizar
  public id_producto = signal<string>('');
  public codigoA = signal<string>('');
  public descripcionA = signal<string>('');
  public marcaA = signal<string>('');
  public categoriaA = signal<string>('');
  public tipoProductoA = signal<string>('');
  public precioA = signal<string>('');
  //funcion que carga los datos desde el html
  public cargarDatos(producto: ProductoConPrecio) {
    console.log(producto);
    this.id_producto.set(producto.idProducto.toString());
    this.codigoA.set(producto.codigo);
    this.descripcionA.set(producto.descripcion);
    this.marcaA.set(producto.marca);
    this.categoriaA.set(producto.categoria);
    if (producto.tipo_producto == 'Perecedero') {
      this.tipoProductoA.set('1');
    }
    if (producto.tipo_producto == 'No perecedero') {
      this.tipoProductoA.set('2');
    }
    this.precioA.set(producto.precio.toString());
    this.mostrarFormularioActualizar();
  }

  public mostrarFormulario() {
    this.switchFormularioCrear.set(!this.switchFormularioCrear());
  }
  public mostrarFormularioActualizar() {
    this.switchFormularioActualizar.set(!this.switchFormularioActualizar());
  }

  private buscarUrl(idProducto: number): string {
    const imagen = this.listaImagenes().find(imagenActual => imagenActual.idProducto === idProducto);
    return imagen ? imagen.url : 'assets/default-image.jpg';
  }

  private buscarIdMarca(nombre: string) {
    const marca = this.listaMarcas().find((marca) => marca.nombre == nombre);
    if (marca) {
      return marca.id_marca;
    } else {
      return 0;
    }
  }

  private buscarIdCategoria(nombre: string) {
    const categoria = this.listaCategorias().find((categoria) => categoria.nombre == nombre);
    if (categoria) {
      return categoria.id_categoria;
    } else {
      return 0;
    }
  }

  public registrarProducto(event: Event) {
    event.preventDefault();
    const codigo = this.codigo();
    const descripcion = this.descripcion();
    const marca = +this.marca();
    const categoria = +this.categoria();
    const tipoProducto = +this.tipoProducto();
    const precio = +this.precio();
    this.productoService.registrarProducto(codigo, descripcion, marca, categoria, tipoProducto, precio).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
        this._bitacoraservices.ActualizarBitacora("Agregó una nuevo Producto: " + descripcion);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El producto fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar producto: " + errorMessage, 'Error');
        }
      }
    });

    this.mostrarFormulario();
    this.codigo.set('');
    this.descripcion.set('');
    this.marca.set('');
    this.categoria.set('');
    this.tipoProducto.set('');
    this.precio.set('');
  }

  public actualizarProducto(event: Event) {
    //Todo: implementar
    event.preventDefault();
    const id = +this.id_producto();
    const codigo = this.codigoA();
    const descripcion = this.descripcionA();
    const marca = this.buscarIdMarca(this.marcaA());
    if (marca == 0) {
      alert('marca no encontrada');
      return;
    }
    const categoria = this.buscarIdCategoria(this.categoriaA());
    if (categoria == 0) {
      alert('categoria no encontrada');
      return
    }
    const tipoProducto = +this.tipoProductoA()
    if (tipoProducto <= 0 || tipoProducto >= 3) {
      alert('Disponibles:Perecedero= 1 y No perecedero= 2');
      return;
    }
    const precio = +this.precioA();
    this.productoService.actualizarProducto(id, codigo, descripcion, marca, categoria, tipoProducto, precio).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
        this._bitacoraservices.ActualizarBitacora("Actualizó un Producto con ID: " + id);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("El producto fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar producto: " + errorMessage, 'Error');
        }
      }
    });

    this.mostrarFormularioActualizar();
    this.codigoA.set('');
    this.descripcionA.set('');
    this.marcaA.set('');
    this.categoriaA.set('');
    this.tipoProductoA.set('');
    this.precioA.set('');
  }

  public onFileSelected(event: any, productoId: number) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);  // Archivo seleccionado
    formData.append('upload_preset', 'electrodomesticos');  // El nombre del preset
    formData.append('public_id', `producto_${productoId}`);  // Nombre personalizado del archivo

    // Subir a Cloudinary
    fetch('https://api.cloudinary.com/v1_1/diqqfka6g/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log('Imagen subida:', data);
        // this.imageUrl.(data.secure_url);
        this.imagenService.registrarImagen(data.secure_url, productoId);  // URL de la imagen subida
      })
      .catch(err => console.error('Error:', err));
  }

  ngOnInit(): void {
    this.productoService.obtenerProductos();
    this.imagenService.obtenerTodasLasImagenes();
    this.marcaService.obtenerMarcas();
    this.categoriaService.obtenerCategorias();
    this.modalReporte.set(false); // Garantiza que al iniciar, el modal esté cer
  }

  public modalReporte = signal<boolean>(false); // Asegurar que está en false

  // Filtros y datos**
  public tipoProductoSeleccionado = signal<string>("");
  public marcaSeleccionada = signal<string>("");
  public categoriaSeleccionada = signal<string>("");
  public formatoSeleccionado = signal<string>("pdf");

  public datosFiltrados = this.listaProductos(); // Inicializar lista de productos

  constructor(private cdRef: ChangeDetectorRef) { }

  // Abrir modal y resetear selección**
  public mostrarModalReporte() {
    console.log("Mostrando modal de reporte...");
    this.columnasDisponibles.set(this.columnasDisponibles().map(col => ({ ...col, seleccionado: false })));
    this.tipoProductoSeleccionado.set("");
    this.marcaSeleccionada.set("");
    this.categoriaSeleccionada.set("");
    this.modalReporte.set(true); // ✅ Abre el modal
    this.cdRef.detectChanges(); // Fuerza actualización de la vista
  }

  // Cerrar modal y restablecer filtros**
  public cerrarModalReporte() {
    console.log("Cerrando modal y restableciendo filtros...");

    this.tipoProductoSeleccionado.set("");
    this.marcaSeleccionada.set("");
    this.categoriaSeleccionada.set("");

    this.datosFiltrados = this.listaProductos(); // Restablecer los productos

    this.modalReporte.set(false); // ✅ Cierra el modal
    this.cdRef.detectChanges(); // Fuerza actualización de la vista
  }

  public columnasDisponibles = signal([
    { nombre: "Código", clave: "codigo", seleccionado: false },
    { nombre: "Descripción", clave: "descripcion", seleccionado: false },
    { nombre: "Marca", clave: "marca", seleccionado: false },
    { nombre: "Categoría", clave: "categoria", seleccionado: false },
    { nombre: "Tipo de Producto", clave: "tipo_producto", seleccionado: false },
    { nombre: "Precio", clave: "precio", seleccionado: false }
  ]);

  public columnasSeleccionadas = computed(() => {
    const seleccionadas = this.columnasDisponibles().filter(col => col.seleccionado);
    console.log("Columnas activas:", seleccionadas); // Para depuración
    return seleccionadas;
  });

  public actualizarColumnasSeleccionadas(columna: any) {
    columna.seleccionado = !columna.seleccionado;

    // 🚀 Forzamos una actualización del estado
    this.columnasDisponibles.set([...this.columnasDisponibles()]);

    console.log("Columnas activas después de cambiar:", this.columnasSeleccionadas());
  }

  public trackFilas(index: number, row: any): any {
    return row;
  }

  public trackColumnas(index: number, col: any): any {
    return col.clave;
  }

  public obtenerDatosFiltrados() {
    return this.listaProductos()
      .filter(producto => {
        const tipo = producto.tipo_producto?.toLowerCase(); // Convertimos a minúsculas para evitar errores de comparación
        const filtroTipo = this.tipoProductoSeleccionado()?.toLowerCase();

        return (
          (!this.categoriaSeleccionada() || producto.categoria === this.categoriaSeleccionada()) &&
          (!this.marcaSeleccionada() || producto.marca === this.marcaSeleccionada()) &&
          (!filtroTipo || tipo === filtroTipo) // 📌 Ahora el filtro de tipo funciona sin problemas
        );
      })
      .map(producto => {
        let datosFiltrados: Record<string, any> = {};
        this.columnasSeleccionadas().forEach(col => {
          datosFiltrados[col.clave] = producto[col.clave as keyof ProductoConPrecio] ?? "Sin datos";
        });
        return datosFiltrados;
      })
      .filter(row => Object.keys(row).length > 0); // Evita filas vacías
  }

  public generarReporte() {
    // Verificar formato seleccionado
    if (!this.formatoSeleccionado()) {
      alert("Por favor, selecciona un formato de exportación.");
      return;
    }
    // Llamar la función adecuada según el formato
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
        alert("Formato desconocido.");
    }
  }

  public generarPDF() {
    const doc = new jsPDF();

    // Logo y Encabezado
    const logoBase64 = 'assets/tiendalogo.png'; // Reemplaza con el Base64 del logo
    const logoWidth = 30;
    const originalWidth = 100;
    const originalHeight = 50;
    const aspectRatio = originalHeight / originalWidth;
    const logoHeight = logoWidth * aspectRatio;
    doc.addImage(logoBase64, 'PNG', 160, 10, logoWidth, logoHeight);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Reporte de Productos', 10, 20);

    const columnasActivas = this.columnasSeleccionadas().map(col => col.nombre);
    const filas = this.obtenerDatosFiltrados().map(row =>
      this.columnasSeleccionadas().map(col => row[col.clave] ?? "Sin datos")
    );

    // Tabla con solo las columnas activas**
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
        fontSize: 12
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

    // Pie de Página Mejorado sin número de página**
    const pageHeight = doc.internal.pageSize.height;

    doc.setDrawColor(200, 200, 200);
    doc.line(10, pageHeight - 30, doc.internal.pageSize.width - 10, pageHeight - 30);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Generado por: Sistema de Gestión de Productos', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });
    doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, doc.internal.pageSize.width / 2, pageHeight - 15, { align: 'center' });

    // Guardar el PDF**
    doc.save('reporte-productos.pdf');
  }

  public generarExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Productos');

    // Encabezados de la Tabla**
    const columnasActivas = this.columnasSeleccionadas().map(col => ({
      header: col.nombre,
      key: col.clave,
      width: 20
    }));

    worksheet.columns = columnasActivas;

    // Ubicar el Título (Ajustado al número exacto de columnas)**
    const totalColumnas = columnasActivas.length;
    const tituloRango = `A1:${String.fromCharCode(65 + totalColumnas - 1)}1`; // 📌 Combinar solo las columnas necesarias
    worksheet.mergeCells(tituloRango);
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = '📊 Reporte de Productos';
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.height = 25;

    worksheet.addRow([]);

    // Información del Reporte**
    const infoReporte = [
      ['Fecha de generación:', new Date().toLocaleString()],
      ['Total productos en reporte:', this.obtenerDatosFiltrados().length]
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

    // Aplicar ajustes de ancho automático a cada columna**
    worksheet.columns.forEach(column => {
      column.width = 25;
    });

    // Encabezados de la Tabla**
    const tableTitles = columnasActivas.map(c => c.header);
    const titlesRow = worksheet.addRow(tableTitles);
    titlesRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007ACC' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Llenar los Datos con Alternancia de Colores**
    let isGray = true;
    this.obtenerDatosFiltrados().forEach(producto => {
      const fila = columnasActivas.map(col => producto[col.key] ?? "Sin datos");
      const dataRow = worksheet.addRow(fila);

      // ALTERNAR COLORES 
      const rowColor = isGray ? 'FFD3D3D3' : 'FFFFFFFF';
      dataRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      isGray = !isGray;
    });

    // Guardar el archivo**
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte-productos.xlsx');
    });
  }

  public generarHTML() {
    console.log("Generando reporte en HTML...");

    // Generar el contenido HTML**
    let contenidoHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte de Productos</title>
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
            <div class="titulo">📊 Reporte de Productos</div>
            <div class="info-reporte">
                <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Total productos en reporte:</strong> ${this.obtenerDatosFiltrados().length}</p>
            </div>
            <table>
                <thead>
                    <tr>${this.columnasSeleccionadas().map(col => `<th>${col.nombre}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${this.obtenerDatosFiltrados().map((producto, index) => `
                        <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F2F2F2'};">
                            ${this.columnasSeleccionadas().map(col => `<td>${producto[col.clave] ?? "Sin datos"}</td>`).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

    //Crear un archivo HTML y descargarlo**
    const blob = new Blob([contenidoHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reporte-productos.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}