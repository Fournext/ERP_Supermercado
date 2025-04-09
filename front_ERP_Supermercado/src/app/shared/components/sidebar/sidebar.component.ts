import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '../../services/menu/menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {
  menuVisible: boolean = false; // Estado inicial del menú

  constructor(private menuService: MenuService) {}

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
}
