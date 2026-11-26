import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-maintenance-lab',
  templateUrl: './maintenance-lab.html',
  styleUrl: '../lab.scss',
})
export class MaintenanceLab {
  protected readonly steps = [
    'Comprobar el estado de Git, las versiones instaladas y la matriz de la versión objetivo.',
    'Ejecutar el build y los tests de referencia y crear una rama desde un commit limpio.',
    'Consultar la guía de actualización y revisar las APIs obsoletas y las dependencias pares.',
    'Ejecutar la actualización en la rama y revisar los cambios automáticos y manuales.',
    'Verificar tests, build de producción y navegación por teclado antes de fusionar.',
  ];

  protected readonly completed = signal<ReadonlySet<string>>(new Set());
  protected readonly remaining = computed(() => this.steps.length - this.completed().size);

  protected toggle(step: string): void {
    this.completed.update((current) => {
      const next = new Set(current);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      return next;
    });
  }
}
