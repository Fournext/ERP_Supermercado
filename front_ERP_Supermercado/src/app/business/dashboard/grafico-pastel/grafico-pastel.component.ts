import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-grafico-pastel',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './grafico-pastel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoPastelComponent {
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Shampoo', 'Jabón', 'Acondicionador'],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ['#4ade80', '#60a5fa', '#f87171'] // colores opcionales
      }
    ]
  };

  public pieChartLegend = true;
  public pieChartPlugins = [];
}
