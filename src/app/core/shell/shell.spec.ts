import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NAV_GROUPS } from './navigation';
import { ShellComponent } from './shell';
import { ThemeService } from './theme';

// The toggle is hidden by CSS on wide viewports and jsdom cannot focus hidden elements.
function showMobileToggle(toggle: HTMLElement | null): void {
  toggle?.style.setProperty('display', 'inline-flex');
}

async function expandAllGroups(fixture: ComponentFixture<ShellComponent>): Promise<void> {
  const compiled = fixture.nativeElement as HTMLElement;
  for (const toggle of Array.from(
    compiled.querySelectorAll<HTMLButtonElement>('.shell__nav-group-toggle[aria-expanded="false"]'),
  )) {
    toggle.click();
  }
  await fixture.whenStable();
}

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([
          { path: '', children: [] },
          { path: 'components', children: [] },
          { path: 'signals', children: [] },
          { path: 'routing', children: [{ path: 'books', children: [] }] },
        ]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose an accessible theme switch in the top bar', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const themeService = TestBed.inject(ThemeService);
    const initialTheme = themeService.theme();
    const previous = localStorage.getItem('atlas.theme');
    const previousAttribute = document.documentElement.getAttribute('data-theme');
    try {
      await fixture.whenStable();
      const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        '.shell__theme-toggle',
      )!;
      expect(button.getAttribute('aria-label')).toBe(
        initialTheme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro',
      );
      button.click();
      await fixture.whenStable();
      expect(themeService.theme()).toBe(initialTheme === 'dark' ? 'light' : 'dark');
      expect(button.getAttribute('aria-label')).toBe(
        initialTheme === 'dark' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro',
      );
    } finally {
      if (previous === null) localStorage.removeItem('atlas.theme');
      else localStorage.setItem('atlas.theme', previous);
      if (previousAttribute === null) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', previousAttribute);
    }
  });

  it('should provide a keyboard skip link to the main content', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.shell__skip')?.getAttribute('href')).toBe('#main-content');
    expect(compiled.querySelector('main')?.id).toBe('main-content');
    const main = compiled.querySelector('main')!;
    const focus = vi.spyOn(main, 'focus');
    compiled.querySelector<HTMLAnchorElement>('.shell__skip')!.click();
    expect(focus).toHaveBeenCalledOnce();
  });

  it('should render every group title as a collapsible toggle', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.shell__nav-group-toggle')).toHaveLength(NAV_GROUPS.length);
    expect(compiled.querySelectorAll('p.shell__nav-group-title')).toHaveLength(0);
  });

  it('should expand the active route group on load and collapse the rest', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const expanded = Array.from(compiled.querySelectorAll('.shell__nav-group-toggle'))
      .filter((toggle) => toggle.getAttribute('aria-expanded') === 'true')
      .map((toggle) => toggle.id);

    expect(expanded).toEqual(['nav-group-start']);
  });

  it('should start with groups collapsed and expand them with aria-expanded', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('#nav-group-foundations')!;
    const list = () => compiled.querySelector(`[aria-labelledby="${toggle.id}"]`);

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(list()).toBeNull();

    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(list()).toBeTruthy();

    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(list()).toBeNull();
  });

  it('should keep the group of the active route expanded', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const compiled = fixture.nativeElement as HTMLElement;

    await TestBed.inject(Router).navigateByUrl('/signals');
    await fixture.whenStable();

    const reactivity = compiled.querySelector('#nav-group-reactivity');
    expect(reactivity?.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('.shell__nav-link--active')?.textContent).toContain('Signals');
    expect(compiled.querySelector('#nav-group-foundations')?.getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('should not focus items of collapsed groups', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('#nav-group-foundations');

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.querySelectorAll('.shell__nav-item--upcoming')).toHaveLength(0);
  });

  it('should render every topic grouped by category', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    await expandAllGroups(fixture);
    const compiled = fixture.nativeElement as HTMLElement;

    const groupTitles = Array.from(compiled.querySelectorAll('.shell__nav-group-title')).map(
      (title) => title.textContent?.trim(),
    );
    expect(groupTitles).toEqual(NAV_GROUPS.map((group) => group.label));

    const labels = Array.from(compiled.querySelectorAll('.shell__nav-list .shell__nav-link-label')).map(
      (label) => label.textContent?.trim(),
    );
    expect(labels).toEqual(NAV_GROUPS.flatMap((group) => group.items.map((item) => item.label)));
    expect(labels).toHaveLength(12);
  });

  it('should label every group list with its category title', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    await expandAllGroups(fixture);
    const compiled = fixture.nativeElement as HTMLElement;

    for (const list of Array.from(compiled.querySelectorAll('.shell__nav-list'))) {
      const titleId = list.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
      expect(compiled.querySelector(`#${titleId}`)?.classList).toContain('shell__nav-group-title');
    }
  });

  it('should link only the available topics', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    await expandAllGroups(fixture);
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('.shell__nav-link'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/components',
      '/signals',
      '/http',
      '/routing',
      '/dependency-injection',
    ]);
    expect(links[0].textContent).toContain('Inicio');
    expect(links[1].textContent).toContain('Componentes');
    expect(links[2].textContent).toContain('Signals y reactividad');
    expect(links[3].textContent).toContain('HTTP y recursos');
    expect(links[4].textContent).toContain('Routing y Lazy Loading');
    expect(links[5].textContent).toContain('Dependency Injection');
  });

  it('should show upcoming topics with a badge and without links', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    await expandAllGroups(fixture);
    const compiled = fixture.nativeElement as HTMLElement;
    const upcoming = Array.from(compiled.querySelectorAll('.shell__nav-item--upcoming'));
    const upcomingCount = NAV_GROUPS.flatMap((group) => group.items).filter(
      (item) => item.status === 'upcoming',
    ).length;

    expect(upcoming).toHaveLength(upcomingCount);
    expect(upcomingCount).toBe(6);
    for (const item of upcoming) {
      expect(item.querySelector('.shell__nav-badge')?.textContent?.trim()).toBe('Próximamente');
      expect(item.querySelector('a')).toBeNull();
      expect(item.closest('a')).toBeNull();
    }
  });

  it('should mark only the active link with aria-current="page"', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const router = TestBed.inject(Router);
    const compiled = fixture.nativeElement as HTMLElement;

    await router.navigateByUrl('/signals');
    await fixture.whenStable();
    await expandAllGroups(fixture);

    const [home, , signals] = Array.from(compiled.querySelectorAll('.shell__nav-link'));
    expect(home.hasAttribute('aria-current')).toBe(false);
    expect(signals.getAttribute('aria-current')).toBe('page');

    await router.navigateByUrl('/');
    await fixture.whenStable();

    expect(home.getAttribute('aria-current')).toBe('page');
    expect(signals.hasAttribute('aria-current')).toBe(false);
  });

  it('should keep the feature link active on a nested route', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/routing/books');
    await fixture.whenStable();
    await expandAllGroups(fixture);

    const activeLinks = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.shell__nav-link--active'),
    );
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0].textContent).toContain('Routing y Lazy Loading');
  });

  it('should toggle the sidebar open state for mobile navigation', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance['sidebarOpen']()).toBe(false);
    expect(compiled.querySelector('main')?.hasAttribute('inert')).toBe(false);

    const toggle = compiled.querySelector<HTMLButtonElement>('.shell__menu-toggle');
    toggle?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance['sidebarOpen']()).toBe(true);
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('.shell__backdrop')).toBeTruthy();
    expect(compiled.querySelector('main')?.hasAttribute('inert')).toBe(true);
  });

  it('should move focus into the sidebar when it opens', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.shell__menu-toggle')?.click();
    await fixture.whenStable();

    const sidebar = compiled.querySelector('.shell__sidebar');
    expect(sidebar?.contains(document.activeElement)).toBe(true);
  });

  it('should close on Escape and return focus to the menu toggle', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.shell__menu-toggle');
    showMobileToggle(toggle);

    toggle?.click();
    await fixture.whenStable();

    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();

    expect(fixture.componentInstance['sidebarOpen']()).toBe(false);
    expect(compiled.querySelector('.shell__backdrop')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it('should close the sidebar and restore focus after choosing a link', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.shell__menu-toggle');
    showMobileToggle(toggle);

    toggle?.click();
    await fixture.whenStable();
    await expandAllGroups(fixture);
    compiled.querySelectorAll<HTMLAnchorElement>('.shell__nav-link')[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance['sidebarOpen']()).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });
});
