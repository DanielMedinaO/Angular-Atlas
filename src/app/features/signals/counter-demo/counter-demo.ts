import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter-demo',
  templateUrl: './counter-demo.html',
  styleUrl: './counter-demo.scss',
})
export class CounterDemoComponent {
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);

  protected increment(): void {
    this.count.update((value) => value + 1);
  }

  protected decrement(): void {
    this.count.update((value) => value - 1);
  }

  protected reset(): void {
    this.count.set(0);
  }
}
