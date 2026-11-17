import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterLink,
  RouterOutlet,
  RoutesRecognized,
} from '@angular/router';
import { GuardDemoState } from './guard-demo';
import {
  GUARDS_SNIPPET,
  PRELOADING_SNIPPET,
  RESOLVER_SNIPPET,
  ROUTE_LOADING_SNIPPET,
} from './routing-snippets';

type TrackedRouterEvent =
  | NavigationStart
  | RoutesRecognized
  | GuardsCheckStart
  | GuardsCheckEnd
  | ResolveStart
  | ResolveEnd
  | NavigationEnd
  | NavigationCancel
  | NavigationError;

@Component({
  selector: 'app-routing-page',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './routing-page.html',
  styleUrl: './routing-page.scss',
})
export class RoutingPage {
  protected readonly routeLoadingSnippet = ROUTE_LOADING_SNIPPET;
  protected readonly resolverSnippet = RESOLVER_SNIPPET;
  protected readonly guardsSnippet = GUARDS_SNIPPET;
  protected readonly preloadingSnippet = PRELOADING_SNIPPET;
  protected readonly routerEvents = signal<readonly string[]>([]);
  protected readonly guardDemo = inject(GuardDemoState);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (this.isTrackedEvent(event)) {
          const entry = `${this.eventName(event)} · ${event.url}`;
          this.routerEvents.update((events) => [...events, entry].slice(-12));
        }
      });
  }

  protected navigateToDemo(path: string): void {
    void this.router.navigateByUrl(path);
  }

  protected toggleActivationPermission(): void {
    this.guardDemo.activationAllowed.update((allowed) => !allowed);
  }

  protected toggleMatchingPermission(): void {
    this.guardDemo.matchingAllowed.update((allowed) => !allowed);
  }

  private isTrackedEvent(event: unknown): event is TrackedRouterEvent {
    return (
      event instanceof NavigationStart ||
      event instanceof RoutesRecognized ||
      event instanceof GuardsCheckStart ||
      event instanceof GuardsCheckEnd ||
      event instanceof ResolveStart ||
      event instanceof ResolveEnd ||
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    );
  }

  private eventName(event: TrackedRouterEvent): string {
    if (event instanceof NavigationStart) return 'NavigationStart';
    if (event instanceof RoutesRecognized) return 'RoutesRecognized';
    if (event instanceof GuardsCheckStart) return 'GuardsCheckStart';
    if (event instanceof GuardsCheckEnd) return 'GuardsCheckEnd';
    if (event instanceof ResolveStart) return 'ResolveStart';
    if (event instanceof ResolveEnd) return 'ResolveEnd';
    if (event instanceof NavigationEnd) return 'NavigationEnd';
    if (event instanceof NavigationCancel) return 'NavigationCancel';
    return 'NavigationError';
  }
}
