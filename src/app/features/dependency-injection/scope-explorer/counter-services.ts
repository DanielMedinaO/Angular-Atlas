import { Service, signal } from '@angular/core';

@Service()
export class RootCounterService {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  increment(): void {
    this._count.update((count) => count + 1);
  }
}

@Service({ autoProvided: false })
export class RouteCounterService {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  increment(): void {
    this._count.update((count) => count + 1);
  }
}

@Service({ autoProvided: false })
export class ComponentCounterService {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();

  increment(): void {
    this._count.update((count) => count + 1);
  }
}
