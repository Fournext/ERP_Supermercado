import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PersonalService } from '../../../services/personal.service';
import { ComprasService } from '../../../services/compras.service';
import { BoletaCompra, DetalleCompra } from '../../../interface/compras.interface';
import { personal } from '../../../interface/personal';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { BoletaEntrada, DetalleBoletaEntradaEnviar, DetalleBoletaEntradaObtenido } from '../../../interface/boletaEntrada.interface';
import { DetalleBoletaService } from '../../../services/detalleBoleta.service';
import { Lote } from '../../../interface/lote';
import { LoteService } from '../../../services/lote.service';
import { DetalleItemComponent } from "./detalle-item/detalle-item.component";
import { BoletaEntradaService } from '../../../services/boleta-entrada.service';
import { Personal } from '../../../interface/Personal2';
import { response } from 'express';
import { error } from 'console';
import { DetalleBoletaEntradaService } from '../../../services/detalle-boleta-entrada.service';
import { BoletaEntradaCompletaComponent } from "./boleta-entrada-completa/boleta-entrada-completa.component";

@Component({
  selector: 'app-boleta-entrada',
  imports: [DetalleItemComponent, BoletaEntradaCompletaComponent],
  templateUrl: './boleta-entrada.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BoletaEntradaComponent {

  private personalService = inject(PersonalService);//devuelve un obserbale
  private boletaCompraService = inject(ComprasService);
  private loteService = inject(LoteService);
  private detalleCompraService = inject(DetalleBoletaService);
  public  boletaEntradaService = inject(BoletaEntradaService);
  private detalleBoletaEntradaService = inject(DetalleBoletaEntradaService);
  private toastr = inject(ToastrService);

  //datos
  fecha = signal<string>('');
  idBoleta = signal<string>('');
  idEmpleado = signal<number>(0);
  descripcion = signal<string>('');



  cantidadActualizada = signal<string>('');
  //listas necesarias

  listaEmpleados = signal<personal[]>([]);
  listaBoletaEntradas=computed(()=>this.boletaEntradaService.listaBoletaEntrada());
  //listaLotes = computed(()=>this.loteService.listaLotes());

  //datos para mostrar poner en el servicio
  boletaCompraActual = signal<BoletaCompra>({
    idBoletaCompra: 0,
    costoTotal: 0.0,
    fecha: '00/00/00',
    idProveedor: 0,
    idMetodoPago: 0,
    estado: ''
  });

  boletaEntrada = signal<BoletaEntrada>({
    idBoleta: 0,
    fecha: '',
    descripcion: '',
    estado: '',
    idBoletaCompra: 0,
    idPersonal: 0
  });

  buscarPersonal(id: number) {
    const personal = this.listaEmpleados().find((personal: personal) => personal.id_personal == id);
    return `${personal?.nombre} ${personal?.apellido}`
  }


  asignarEmpleado(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.idEmpleado.set(+valor);
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

  obtenerLosDetalles(id: number) {
    this.detalleCompraService.obtenerDetallesBoletaCompra(id).subscribe(
      (response) => {
        const listaDetalles = response.map((detalleCompra: DetalleCompra) => {
          const detalleActual: DetalleBoletaEntradaEnviar = {
            cantidad: 0,
            cantidadComprada: detalleCompra.cantidad,
            costoUnitario: detalleCompra.costoUnitario,
            idBoletaEntrada: 0,
            idProducto: detalleCompra.idProducto,
            idLote: 0
          }
          return detalleActual;
        })
        this.boletaEntradaService.listaDetalleActual.set(listaDetalles);
      }
    )
  }

  iniciarBoletaEntrada() {
    this.boletaCompraService.obtenerBoleta(+this.idBoleta()).subscribe({
      next: (response) => {
        this.boletaCompraActual.set(response);
        console.log({ response });
        this.obtenerLosDetalles(response.idBoletaCompra);
        this.toastr.success("Iniciado correctamente");
        //con esto reseteamos los datos si lo encuentra
        // this.fecha.set('');
        // this.idBoleta.set('');
        // this.idEmpleado.set(0);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La boleta fue regisrada pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al iniciar la boleta: " + errorMessage, 'Error');
        }
      }
    })
  }

  registrarBoletaEntrada() {
    const fecha = this.fecha();
    const descripcion = this.descripcion();
    const idBoletaCompra = +this.idBoleta();
    const estado = 'Aprobado';
    const idPersonal = this.idEmpleado();

    this.boletaEntradaService.registrarBoleta(fecha, descripcion, idBoletaCompra, estado, idPersonal).subscribe({
      next: (response) => {
        this.boletaEntrada.set(response);
        this.toastr.success("El registro fue exitoso");
        this.registrarDetalleBoletaEntrada();
      },
      error: (error) => {
        this.toastr.error("No se pudo registrar la boleta, revisar datos");
      }
    })
  }

  eliminarBoletaEntrada(boleta:BoletaEntrada){
    const respuesta=confirm("Estas seguro de eliminar la boleta?");
    if(respuesta){
      this.boletaEntradaService.eliminarBoleta(boleta.idBoleta);
    }else{
      return;
    }
  }

  registrarDetalleBoletaEntrada() {
    this.boletaEntradaService.listaDetalleActual().map((detalle: DetalleBoletaEntradaEnviar) => {
      this.detalleBoletaEntradaService.registrarDetalleBoleta(detalle.cantidad, this.boletaEntrada().idBoleta, detalle.idProducto, detalle.cantidadComprada, detalle.costoUnitario, detalle.idLote);
    })
  }
  //esto lo usamos para mostrar el modal
  mostrarBoletaEntrada(boleta:BoletaEntrada) {
    this.detalleBoletaEntradaService.obtenerDetallesByIdBoletaEntrada(boleta.idBoleta);
    this.boletaEntradaService.boletaActual.set(boleta);
    this.boletaEntradaService.mostrarModalSwitch();

  }

  ngOnInit() {
    this.personalService.listarPersonal().subscribe(
      (response) => {
        const listaPersonal = response.map((personalActual) => {
          const personalActual2: personal = {
            id_personal: personalActual.id_personal,
            nombre: personalActual.nombre,
            apellido: personalActual.apellido,
            carnet: personalActual.carnet,
            fecha_creacion: personalActual.fecha_creacion,
            idRol: personalActual.idRol,
            idTurno: personalActual.idTurno,
            idUsuario: personalActual.idUsuario
          }
          return personalActual2;
        }
        );
        this.listaEmpleados.set(listaPersonal);
      }
    )

    this.loteService.getLotes().subscribe(
      (response) => {
        const listaLote = response.map((loteActual: Lote) => {
          const loteActual2: Lote = {
            id_lote: loteActual.id_lote,
            stock: loteActual.stock,
            stock_minimo: loteActual.stock_minimo,
            cod_repisa: loteActual.cod_repisa,
            nombre_estado: loteActual.nombre_estado,
            descripcion_producto: loteActual.descripcion_producto,
            cod_almacen: loteActual.cod_almacen,
            costo_unitario: loteActual.costo_unitario,
            fecha_caducidad: loteActual.fecha_caducidad
          }
          return loteActual2;
        }
        );
        this.loteService.listaLotes.set(listaLote);
      }
    )
    this.boletaEntradaService.getBoletaEntradas();
  }
}

