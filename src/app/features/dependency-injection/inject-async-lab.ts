import { Component, injectAsync, signal } from '@angular/core';

type ExportStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-inject-async-lab',
  template: `
    <button type="button" [disabled]="status() === 'loading'" (click)="exportReport()">
      {{ status() === 'loading' ? 'Preparando informe…' : 'Generar informe' }}
    </button>
    <p class="di-async-result" aria-live="polite">
      @if (status() === 'loading') {
        Cargando el servicio exportador…
      } @else if (status() === 'success') {
        {{ result() }}
      } @else if (status() === 'error') {
        <span role="alert">No se pudo generar el informe: {{ errorMessage() }}</span>
      } @else {
        El exportador todavía no se ha cargado.
      }
    </p>
  `,
  styleUrl: './di-labs.scss',
})
export class InjectAsyncLab {
  private readonly loadExporter = injectAsync(() =>
    import('./report-exporter').then((module) => module.ReportExporter),
  );
  protected readonly status = signal<ExportStatus>('idle');
  protected readonly result = signal('');
  protected readonly errorMessage = signal('');

  protected async exportReport(): Promise<void> {
    this.status.set('loading');
    this.errorMessage.set('');

    try {
      const exporter = await this.loadExporter();
      this.result.set(exporter.export());
      this.status.set('success');
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Error desconocido al generar el informe.',
      );
      this.status.set('error');
    }
  }
}
