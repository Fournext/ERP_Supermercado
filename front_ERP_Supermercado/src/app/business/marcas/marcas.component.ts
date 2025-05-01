import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Marca } from '../../../interface/marca.interface';
import { MarcaService } from '../../../services/marca.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marcas',
  imports: [CommonModule, FormsModule],
  templateUrl: './marcas.component.html',
  styleUrl: './marcas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarcasComponent {
  private marcaService = inject(MarcaService);
  private toastr = inject(ToastrService);

  //atributos para los formularios
  public nombre = signal<string>('');
  public nuevoNombre = signal<string>('');
  public antiguoNombre = signal<string>('');

  //datos del estado global
  public listaMarcas = computed(() => this.marcaService.listaMarcas());

  // Agregamos la variable de búsqueda
  public filtroBusqueda = signal<string>('');

  // Filtrar marcas en tiempo real
  public marcasFiltradas = computed(() => {
    return this.listaMarcas().filter((marca) =>
      marca.nombre.toLowerCase().includes(this.filtroBusqueda().toLowerCase())
    );
  });


  public registrarMarca() {
    const nombre: string = this.nombre();
    this.marcaService.registrarMarca(nombre).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La marca fue insertado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar marca: " + errorMessage, 'Error');
        }
      }
    })
    this.nombre.set('');
  }
  //buscar el id del nombre
  private buscarId(nombre: string) {
    const marca = this.listaMarcas().find((marca: Marca) => marca.nombre == nombre);
    if (marca) {
      return marca.id_marca;
    } else {
      return 0;
    }
  }

  public actualizarMarca() {
    const antiguoNombre = this.antiguoNombre();
    const id = this.buscarId(antiguoNombre);
    if (id == 0) {
      alert('marca no encontrada');
      return;
    }
    const nuevoNombre: string = this.nuevoNombre();
    this.marcaService.actualizarMarca(id, nuevoNombre).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success("Actualizacion exitosa");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La marca fue actualizada pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar marca: " + errorMessage, 'Error');
        }
      }
    })
    this.nuevoNombre.set('');
    this.antiguoNombre.set('');
  }


  ngOnInit(): void {
    this.marcaService.obtenerMarcas();
  }
}