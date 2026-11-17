import { inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, CanMatchFn } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuardDemoState {
  readonly activationAllowed = signal(false);
  readonly matchingAllowed = signal(false);
}

export const canActivateDemo: CanActivateFn = () => inject(GuardDemoState).activationAllowed();

export const canMatchDemo: CanMatchFn = () => inject(GuardDemoState).matchingAllowed();
