import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CardComponent } from '../components/card/card.component';
import { FooterComponent } from "../components/footer/footer.component";
import { ProductoConPrecio } from '../../../interface/producto.interface';

@Component({
  selector: 'app-inicio',
  imports: [NavbarComponent, FooterComponent, CardComponent, FooterComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  produc: ProductoConPrecio[] = [];


}
