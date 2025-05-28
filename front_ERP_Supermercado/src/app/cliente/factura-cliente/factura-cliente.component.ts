import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { MetodoPagoService } from '../../../services/metodoPago.service';
import { FacturaService } from '../../../services/factura.service';
import { Router, RouterLink } from '@angular/router';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { Factura } from '../../../interface/factura.interface';
import { Cliente } from '../../../interface/cliente';
import { DetalleCarrito } from '../../../interface/carrito';
import { DetalleCarritoService } from '../../../services/detalle-carrito.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BoletaRecepcionService } from '../../../services/boleta-recepcion.service';
import { BoletaRecepcion } from '../../../interface/boleta_recepcion';

@Component({
  selector: 'factura-cliente',
  imports: [FormsModule,CommonModule],
  templateUrl: './factura-cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaClienteComponent {
  private clienteService = inject(ClienteService);
  private boletaValoracion = inject(BoletaRecepcionService);
  private metodoPagoService = inject(MetodoPagoService);
  private facturaSercice = inject(FacturaService);
  private DetalleCarritoService = inject(DetalleCarritoService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  listaFactura = computed(() => this.facturaSercice.listaFactura());
  metodoPago = computed(() => this.metodoPagoService.listaMetodoPago()[0]);
  clienteActual = this.clienteService.clienteActual;
  ListValoraciones: BoletaRecepcion[] = [];

  mostrarValoracion = false;
  rating = 0;
  descripcionValoracion = '';
  facturaValorada: Factura | null = null;
  valorada: Boolean = false;

  newValoracion: BoletaRecepcion = {
    descripcion: '',
    puntaje: 0,
    idCliente: this.clienteActual().idCliente || 1,
    idFactura: 0,
    nombreCliente: ''
  }

  volver() {
    this.router.navigate(["/ecommerce"]);
  }


  exportar(factura: Factura, cliente: Cliente) {
    this.DetalleCarritoService.obtenerDetalleCarrito(factura.idCarrito).subscribe(
      (response) => {
        this.exportarFacturaPDF(factura, cliente, response);
      }
    )

  }

exportarFacturaPDF(factura: Factura, cliente: Cliente, detalles: DetalleCarrito[]) {
  const doc = new jsPDF();
  const fechaHoy = new Date();
  const fechaStr = fechaHoy.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // 🧾 Título principal
  doc.setFontSize(16);
  doc.text('Supermercado XYZ', 14, 15);
  doc.setLineWidth(0.5);
  doc.line(14, 18, 195, 18);

  // 🧾 Nº de Factura (arriba izquierda)
  doc.setFontSize(10);
  doc.text(`Factura Nº: ${factura.idFactura}`, 14, 25);

  // 👤 Cliente (izquierda debajo del Nº factura)
  doc.text(`Cliente: ${cliente.nombreCliente} ${cliente.nombreApellido}`, 14, 30);
  doc.text(`Carnet: ${cliente.carnetCliente}`, 14, 35);
  doc.text(`NIT: ${cliente.nitCliente}`, 14, 40);
  doc.text(`Dirección: ${cliente.direccionCliente}`, 14, 45);

  // 📅 Fechas (arriba derecha)
  const rightX = 140;
  doc.text(`Fecha emisión: ${factura.fecha}`, rightX, 25);
  doc.text(`Fecha vencimiento: ${factura.fechaVencimiento}`, rightX, 30);

  // 🛒 Tabla de productos
  const encabezado = [['Descripción', 'Cantidad', 'Precio (Bs)', 'Subtotal (Bs)']];
  const filas = detalles.map(item => [
    item.descripcion,
    item.cantidad.toString(),
    item.precio.toFixed(2),
    item.subtotal.toFixed(2)
  ]);

  autoTable(doc, {
    head: encabezado,
    body: filas,
    startY: 55,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [63, 81, 181], textColor: 255 },
    margin: { left: 14, right: 14 },
  });

  // 💲 Total
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(12);
  doc.text(`Total: ${factura.total.toFixed(2)} Bs`, 200, finalY + 10, { align: 'right' });

  // 💾 Guardar
  const nombreArchivo = `factura_${factura.idFactura}_${fechaStr.replace(/\//g, '-')}.pdf`;
  doc.save(nombreArchivo);
}

abrirValoracion(factura: Factura) {
    this.facturaValorada = factura;
    const encontrada = this.ListValoraciones.find(v => v.idFactura === factura.idFactura);
    if (encontrada) {
      this.rating = encontrada.puntaje || 0;
      this.descripcionValoracion = encontrada.descripcion || '';
      this.toastr.info('Ya has valorado esta factura', 'Información');
    } else {
      this.rating = 0;
      this.descripcionValoracion = '';
    }
    this.mostrarValoracion = true;
  }

  cerrarValoracion() {
  this.mostrarValoracion = false;
}

setRating(star: number) {
  this.rating = star;
}

 guardarValoracion() {
    if (this.facturaValorada) {
      const existente = this.ListValoraciones.find(v => v.idFactura === this.facturaValorada?.idFactura);
      const boleta = {
        idBoleta: existente?.idBoleta,
        descripcion: this.descripcionValoracion,
        puntaje: this.rating,
        idCliente: this.clienteActual().idCliente || 1,
        idFactura: this.facturaValorada.idFactura
      };
      const accion = existente
        ? this.boletaValoracion.actualizarBoleta_Recepcion(boleta)
        : this.boletaValoracion.newBoleta_Recepcion(boleta);

      accion.subscribe(() => {
        this.toastr.success('Valoración guardada exitosamente', 'Éxito');
        this.getValoraciones();
      });
    }
  }

  getValoraciones(){
    this.boletaValoracion.getBoletas_Recepcion().subscribe((data)=>{
      this.ListValoraciones = data;
    });
  }

  ngOnInit() {
    this.facturaSercice.obtenerFacturas(this.clienteActual().idCliente || 1);
    this.metodoPagoService.getMetodoPagos();
    this.getValoraciones();
  }

}
