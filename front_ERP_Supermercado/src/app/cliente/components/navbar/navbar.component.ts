import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, HostListener, inject, OnInit, Output, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../../services/categoria.service';
import { Router, RouterLink } from '@angular/router';
import { Categoria } from '../../../../interface/categoria.interface';
import { AuthService } from '../../../../services/auth-service.service';
import { UserService } from '../../../../services/user.service';
import { CarritoService } from '../../../../services/carrito.service';
import { DetalleCarritoService } from '../../../../services/detalle-carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  userService = inject(UserService);
  private carritoService = inject(CarritoService);
  private detalleCarritoService = inject(DetalleCarritoService);


  mostrarCategoria = false;
  mostrarMarca = false;

  listaCategorias = computed(() => this.categoriaService.listaCategorias());
  filtroBusqueda = signal<string>('');



  toggleCategoria() {
    this.mostrarCategoria = !this.mostrarCategoria;
    this.mostrarMarca = false; // cerrar otro si estaba abierto
  }

  toggleMarca() {
    this.mostrarMarca = !this.mostrarMarca;
    this.mostrarCategoria = false; // cerrar otro si estaba abierto
  }

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

  cuentaAcciones(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    if (valor == "datos") {
      this.router.navigate(["/ecommerce/cliente"]);
    } else {
      this.router.navigate(["/ecommerce/factura"]);
    }
  }

  inicioDeSesionTipo(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    if (valor == 'cliente') {
      this.router.navigate(['/login-cliente']);
    } else {
      this.router.navigate(['/login'])
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.userService.usuarioActual.set({
      id: 0,
      username: '',
      email: '',
      password: ''
    });
    this.router.navigate(['/ecommerce']);
    window.location.reload();
  }

}
