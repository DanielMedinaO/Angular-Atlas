import {
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { ArcElement, Chart, DoughnutController, Tooltip, type ChartOptions } from 'chart.js';
import { ThemeService } from '../../../../core/shell/theme';
import { dates, readingSeries, totalDays } from './reading-chart-data';

Chart.register(DoughnutController, ArcElement, Tooltip);

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const numberFormatter = new Intl.NumberFormat('es-CO');
const dateLabels = dates.map((date) => dateFormatter.format(date));
const seriesColors = {
  angular: '--atlas-accent-strong',
  typescript: '--reading-blue',
  accessibility: '--reading-teal',
};

@Component({
  selector: 'app-performance-reading-chart',
  templateUrl: './reading-chart.html',
  styleUrls: ['../../shared/lab-controls.scss', './reading-chart.scss'],
})
export class ReadingChart {
  protected readonly period = signal(totalDays);
  protected readonly chartType = signal<'doughnut' | 'pie'>('doughnut');
  protected readonly chartLabel = computed(() =>
    this.chartType() === 'pie' ? 'Gráfico de pastel' : 'Gráfico de anillo',
  );
  protected readonly percent = new Intl.NumberFormat('es-CO', {
    style: 'percent',
    maximumFractionDigits: 1,
  });
  protected readonly series = readingSeries;
  protected readonly totalDays = totalDays;
  protected readonly number = numberFormatter;
  protected readonly pageSize = 15;
  protected readonly page = linkedSignal({ source: this.period, computation: () => 0 });
  protected readonly start = computed(() => totalDays - this.period());
  protected readonly valueCount = computed(() => this.period() * this.series.length);
  protected readonly pageCount = computed(() => Math.ceil(this.period() / this.pageSize));
  protected readonly metrics = computed(() =>
    this.series.map(({ key, label, values }) => ({
      key,
      label,
      total: values.slice(this.start()).reduce((sum, value) => sum + value, 0),
    })),
  );
  protected readonly total = computed(() =>
    this.metrics().reduce((sum, metric) => sum + metric.total, 0),
  );
  protected readonly rows = computed(() => {
    const first = this.start() + this.page() * this.pageSize;
    return dateLabels.slice(first, first + this.pageSize).map((date, index) => ({
      date,
      values: this.series.map((series) => series.values[first + index]),
    }));
  });

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly theme = inject(ThemeService);
  private chart?: Chart<'doughnut'>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());

    afterRenderEffect(() => {
      const metrics = this.metrics();
      const total = this.total();
      const type = this.chartType();
      this.theme.theme();
      if (typeof CanvasRenderingContext2D === 'undefined') return;

      const canvas = this.canvas().nativeElement;
      const styles = getComputedStyle(canvas);
      const options: ChartOptions<'doughnut'> = {
        maintainAspectRatio: false,
        animation: false,
        // Chart.js uses the same arcs for pie and doughnut. A zero cutout fills the center.
        cutout: type === 'pie' ? 0 : '64%',
        layout: { padding: 6 },
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => {
                const count = this.number.format(item.parsed);
                const share = this.percent.format(item.parsed / total);
                return `${count} lecturas · ${share}`;
              },
            },
          },
        },
      };

      const data = {
        labels: metrics.map(({ label }) => label),
        datasets: [
          {
            data: metrics.map(({ total }) => total),
            backgroundColor: metrics.map(({ key }) =>
              styles.getPropertyValue(seriesColors[key]).trim(),
            ),
            borderColor: styles.getPropertyValue('--atlas-surface').trim(),
            borderWidth: 3,
            hoverOffset: 5,
          },
        ],
      };

      if (this.chart) {
        this.chart.data = data;
        this.chart.options = options;
        this.chart.update('none');
      } else {
        this.chart = new Chart(canvas, { type: 'doughnut', data, options });
      }
    });
  }

  protected changePage(delta: number): void {
    this.page.update((page) => Math.max(0, Math.min(page + delta, this.pageCount() - 1)));
  }
}
