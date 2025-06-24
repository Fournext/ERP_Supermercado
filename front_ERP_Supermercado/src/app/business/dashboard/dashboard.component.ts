import { Component } from '@angular/core';
import { GraficoBarrasComponent } from "./grafico-barras/grafico-barras.component";
import { GraficoPastelComponent } from "./grafico-pastel/grafico-pastel.component";

@Component({
  selector: 'app-dashboard',
  imports: [GraficoBarrasComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {

}
