import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { FacturaService } from '../../../../services/factura.service';
import { MontoVentaDiaria, VentaDiarioProducto } from '../../../../interface/graficos.interface';

Chart.register(...registerables);

@Component({
  selector: 'grafico-barras-ventas',
  standalone: true,
  imports: [],
  templateUrl: './grafico-barras.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoBarrasComponent implements OnInit {
  private facturaService = inject(FacturaService);

  // Fechas por defecto
  inicio = signal<string>('2025-05-01');
  fin = signal<string>('2025-05-31');

  // Almacenar instancias de gráficos
  private charts: Record<string, Chart<keyof ChartTypeRegistry, (number | null)[], unknown>> = {};

  ngOnInit(): void {
    this.renderizarGraficos();
  }

  renderizarGraficos() {
    const inicio = this.inicio();
    const fin = this.fin();

    this.facturaService.obtenerMontoVentaDiario(inicio, fin).subscribe((data: MontoVentaDiaria[]) => {
      this.renderMontoVentaDiaria(data);
    });

    this.facturaService.obtenerDatosVentaDiariaProductos(inicio, fin).subscribe((data: VentaDiarioProducto[]) => {
      this.renderVentaDiarioProducto(data);
    });
  }

  renderMontoVentaDiaria(data: MontoVentaDiaria[]) {
    const labels = data.map(d => d.fecha);
    const values: (number | null)[] = data.map(d => d.total);
    const colors = labels.map(() => this.getRandomColor());

    this.renderChart(labels, values, colors, 'montoDiarioChart', 'bar', 'Monto total vendido por día');
  }

  renderVentaDiarioProducto(data: VentaDiarioProducto[]) {
    const grouped = new Map<string, number>();

    data.forEach(item => {
      const current = grouped.get(item.descripcion) || 0;
      grouped.set(item.descripcion, current + item.cantidadTotal);
    });

    const labels = Array.from(grouped.keys());
    const values: (number | null)[] = Array.from(grouped.values());
    const colors = labels.map(() => this.getRandomColor());

    this.renderChart(labels, values, colors, 'ventaProductoChart', 'bar', 'Cantidad total vendida por producto');
  }

  renderChart(
    labeldata: string[],
    valuedata: (number | null)[],
    colordata: string[],
    chartId: string,
    chartType: keyof ChartTypeRegistry,
    title: string
  ) {
    // Destruir gráfico previo si existe
    const existingChart = this.charts[chartId];
    if (existingChart) {
      existingChart.destroy();
    }

    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const newChart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labeldata,
        datasets: [{
          label: title,
          data: valuedata,
          backgroundColor: colordata,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: title }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    this.charts[chartId] = newChart;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
