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
import { NgOptimizedImage } from '@angular/common';
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
