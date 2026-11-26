import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { Location, NgOptimizedImage } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { findGroupIdByPath, NAV_GROUPS, NavGroup } from './navigation';
import { ThemeService } from './theme';

@Component({
  selector: 'app-shell',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent {
  protected readonly navGroups: readonly NavGroup[] = NAV_GROUPS;

  protected readonly sidebarOpen = signal(false);
  protected readonly themeService = inject(ThemeService);

  private readonly router = inject(Router);
  private readonly authorUrl = this.router.createUrlTree(['/'], { fragment: 'autor' });
  protected readonly authorHref = inject(Location).prepareExternalUrl(
    this.router.serializeUrl(this.authorUrl),
  );
  private authorScrollFrame?: number;
  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] },
  );
  private readonly activeGroupId = computed(() => findGroupIdByPath(this.currentPath()));

  // Expanded groups follow the active route but can still be toggled manually.
  private readonly expandedGroupIds = linkedSignal<string | undefined, ReadonlySet<string>>({
    source: this.activeGroupId,
    computation: (activeId, previous) => {
      const expanded = new Set(previous?.value);
      if (activeId) {
        expanded.add(activeId);
      }
      return expanded;
    },
  });

  private readonly injector = inject(Injector);
  private readonly menuToggle = viewChild.required<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly sidebar = viewChild.required<ElementRef<HTMLElement>>('sidebar');
  private readonly mainContent = viewChild.required<ElementRef<HTMLElement>>('mainContent');

  protected skipToMain(event: MouseEvent): void {
    event.preventDefault();
    this.mainContent().nativeElement.focus();
  }

  protected async scrollToAuthor(event: MouseEvent): Promise<void> {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    if (this.router.url !== this.router.serializeUrl(this.authorUrl)) {
      const navigated = await this.router.navigateByUrl(this.authorUrl, { scroll: 'manual' });
      if (!navigated) return;
    }

    const main = this.mainContent().nativeElement;
    const viewport = main.ownerDocument.defaultView;
    if (!viewport) return;
    if (this.authorScrollFrame !== undefined) {
      viewport.cancelAnimationFrame(this.authorScrollFrame);
    }

    this.authorScrollFrame = viewport.requestAnimationFrame(() => {
      this.authorScrollFrame = undefined;
      const footer = main.querySelector<HTMLElement>('#autor');
      if (!footer) return;

      footer.focus({ preventScroll: true });
      const start = viewport.scrollY;
      const distance = Math.min(
        footer.getBoundingClientRect().top,
        main.ownerDocument.documentElement.scrollHeight - viewport.innerHeight - start,
      );
      if (viewport.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        viewport.scrollTo({ top: start + distance });
        return;
      }
      if (Math.abs(distance) < 1) return;

      const duration = 1050;
      const startTime = viewport.performance.now();
      const animate = (now: number) => {
        this.authorScrollFrame = undefined;
        if (!footer.isConnected) return;

        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = (1 - Math.cos(Math.PI * progress)) / 2;
        viewport.scrollTo({ top: start + distance * easedProgress });
        if (progress < 1) {
          this.authorScrollFrame = viewport.requestAnimationFrame(animate);
        }
      };
      this.authorScrollFrame = viewport.requestAnimationFrame(animate);
    });
  }

  protected isExpanded(group: NavGroup): boolean {
    return this.expandedGroupIds().has(group.id);
  }

  protected toggleGroup(group: NavGroup): void {
    this.expandedGroupIds.update((expanded) => {
      const next = new Set(expanded);
      if (!next.delete(group.id)) {
        next.add(group.id);
      }
      return next;
    });
  }

  protected toggleSidebar(): void {
    if (this.sidebarOpen()) {
      this.closeSidebar();
      return;
    }

    this.sidebarOpen.set(true);
    afterNextRender(() => this.sidebar().nativeElement.querySelector('a')?.focus(), {
      injector: this.injector,
    });
  }

  protected closeSidebar(): void {
    if (!this.sidebarOpen()) {
      return;
    }

    this.sidebarOpen.set(false);
    this.menuToggle().nativeElement.focus();
  }
}
