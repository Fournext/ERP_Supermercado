import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Categoria } from '../../../interface/categoria.interface';
import { CategoriaService } from '../../../services/categoria.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoriaComponent {

  private categoriaService = inject(CategoriaService);
  private toastr = inject(ToastrService);

  //atributos para los formularios
  public nombre = signal<string>('');

  public nuevoNombre = signal<string>('');
  public antiguoNombre=signal<string>('');

  //datos del estado global
  public listaCategorias = computed(() => this.categoriaService.listaCategorias());
  
  public registrarCategoria() {
    const nombre: string = this.nombre();
    this.categoriaService.registrarCategoria(nombre).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success("Registro exitoso");
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error:', e);  // Agrega un log completo para ver todo el error
        const errorMessage = e.error?.message || e.error?.detail || "Error desconocido";

        // Ajustar la lógica de error según el mensaje recibido
        if (errorMessage.includes("violates") && errorMessage.includes("not-null")) {
          this.toastr.warning("La categoria fue registrado pero ocurrió un problema con los campos.", 'Advertencia');
        } else {
          this.toastr.error("Error al registrar marca: " + errorMessage, 'Error');
        }
      }
    })
    this.nombre.set('');
  }
  //buscar el id del nombre
  private buscarId(nombre:string) {
    const categoria = this.listaCategorias().find((categoria: Categoria) => categoria.nombre == nombre);
    if (categoria) {
      return categoria.id_categoria;
    } else {
      return 0;
    }
  }

  public actualizarCategoria() {
    const antiguoNombre=this.antiguoNombre();
    const id = this.buscarId(antiguoNombre);
    if (id == 0) {
      alert('marca no encontrada');
      return;
    }
    const nuevoNombre: string = this.nuevoNombre();
    this.categoriaService.actualizarCategoria(id, nuevoNombre).subscribe({
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
    this.categoriaService.obtenerCategorias();
  }

  // Agregamos la variable de búsqueda
  public filtroBusqueda = signal<string>(''); 

  // Filtrar categorías en tiempo real
  public categoriasFiltradas = computed(() => {
    return this.listaCategorias().filter((categoria) =>
      categoria.nombre.toLowerCase().includes(this.filtroBusqueda().toLowerCase())
    );
  });
}