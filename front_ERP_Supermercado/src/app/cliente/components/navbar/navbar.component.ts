import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, OnInit, Output, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../../services/categoria.service';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../../interface/categoria.interface';
import { AuthService } from '../../../../services/auth-service.service';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  mostrarCategoria = false;
  mostrarMarca = false;

  toggleCategoria() {
    this.mostrarCategoria = !this.mostrarCategoria;
    this.mostrarMarca = false; // cerrar otro si estaba abierto
  }

  toggleMarca() {
    this.mostrarMarca = !this.mostrarMarca;
    this.mostrarCategoria = false; // cerrar otro si estaba abierto
  }

  private categoriaService = inject(CategoriaService);
  public authService=inject(AuthService);
  public listaCategorias = computed(() => this.categoriaService.listaCategorias());
  public filtroBusqueda = signal<string>('');


  //xD


  public categoriasFiltradas = computed(() => {
    return this.listaCategorias().filter((categoria) =>
      categoria.nombre.toLowerCase().includes(this.filtroBusqueda().toLowerCase())
    );
  });

  categorias: Categoria[] = [];
  ngOnInit(): void {
    this.categoriaService.obtenerCategorias();
  }

  filtarCategoria(nombre: string) {
    this.filtrar.emit({ id_categoria: nombre });
  }

  @Output() filtrar = new EventEmitter<any>();

  @Output() borrarFiltro = new EventEmitter<void>();
  borrarFiltros() {
    this.borrarFiltro.emit();
  }
}
