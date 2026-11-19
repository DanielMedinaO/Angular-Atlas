import { Service } from '@angular/core';

@Service()
export class ReportExporter {
  export(): string {
    return 'Informe de biblioteca listo para descargar.';
  }
}
