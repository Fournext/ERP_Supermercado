import { Component, computed, inject, OnInit } from '@angular/core';
import { ProductoConPrecio } from '../../../../interface/producto.interface';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  private productoService = inject(ProductoService);
  public productos = computed(() => this.productoService.listaProductos());

  ngOnInit() {
    this.productoService.obtenerProductos();
  }

}
