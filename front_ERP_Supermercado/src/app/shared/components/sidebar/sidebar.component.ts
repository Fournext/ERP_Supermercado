import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '../../services/menu/menu.component';
import { ToastrService } from 'ngx-toastr';
import { BitacoraService } from '../../../../services/bitacora.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {
  menuVisible: boolean = false; // Estado inicial del menú
  mostrarSector: boolean = false;
  

  constructor(
    private menuService: MenuService,
    private router: Router,
    private toastr: ToastrService,
    private _bitacoraservices: BitacoraService
  ) {}

  ngOnInit(): void {
    // Escucha los cambios del estado del menú desde el servicio
    this.menuService.menuVisible$.subscribe((visible) => {
      this.menuVisible = visible;
    });
  }

  // Escuchar cambios en el tamaño de la ventana
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  // Verificar si el tamaño de la pantalla es grande para ocultar el menú responsivo
  private checkScreenSize(): void {
    const isLargeScreen = window.innerWidth >= 1280; // 1280px para pantallas grandes
    if (isLargeScreen && this.menuVisible) {
      this.menuService.toggleMenu(); // Oculta el menú si está visible
    }
  }

  // Método para cerrar el menú después de seleccionar una opción
  closeMenu(): void {
    if (this.menuVisible) {
      this.menuService.toggleMenu(); // Ocultar el menú si está activo
    }
  }

  toggleSubMenuRepisa() {
    this.mostrarSector = !this.mostrarSector;
  }

  ocultarSector() {
    this.mostrarSector = false;
  }
  

  logout() {
    this._bitacoraservices.ActualizarBitacora("Cerro Sesion");
    localStorage.removeItem('token');
    
    this.toastr.success('Sesión cerrada correctamente', 'Logout');
  
    // Espera 1 segundo para que se vea el mensaje
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // 1000 ms = 1 segundo
  }  

}
