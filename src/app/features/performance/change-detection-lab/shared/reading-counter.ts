import { computed, DestroyRef, ElementRef, inject, isDevMode, signal } from '@angular/core';

export abstract class EvaluationProbe {
  private readonly diagnostic = isDevMode();
  private evaluations = 0;

  protected recordEvaluation(): string {
    if (this.diagnostic) {
      this.evaluations++;
    }
    return '';
  }

  protected displayEvaluations(metric: ElementRef<HTMLElement>): void {
    // This isolated diagnostic node has no Angular binding nor signal writes.
    const value = this.diagnostic ? String(this.evaluations) : 'solo en desarrollo';
    if (metric.nativeElement.textContent !== value) {
      metric.nativeElement.textContent = value;
    }
  }
}

export abstract class ReadingCounter extends EvaluationProbe {
  protected abstract readonly strategy: string;
  protected abstract readonly strategyHint: string;
  protected readonly readings = signal(0);
  protected readonly pages = computed(() => this.readings() * 24);
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => {
      for (const timer of this.timers) clearTimeout(timer);
    });
  }

  protected increment(): void {
    this.readings.update((count) => count + 1);
  }

  protected incrementLater(): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      this.increment();
    }, 600);
    this.timers.add(timer);
  }
}
