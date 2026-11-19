import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { vi } from 'vitest';
import { routes } from '../../app.routes';
import { DependencyInjectionPage } from './dependency-injection-page';
import { InjectAsyncLab } from './inject-async-lab';
import { InjectionTokenLab } from './injection-token-lab';
import {
  ComponentCounter,
  ComponentCounterLab,
} from './scope-explorer/component-counter-lab';
import {
  ComponentCounterService,
  RootCounterService,
  RouteCounterService,
} from './scope-explorer/counter-services';
import { RootCounterLab } from './scope-explorer/root-counter-lab';
import { AdminRouteLab, LibraryRouteLab } from './scope-explorer/route-counter-lab';

describe('Dependency Injection labs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootCounterLab, ComponentCounterLab, InjectionTokenLab, InjectAsyncLab],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shares the root service state between two consumers', () => {
    const fixture = TestBed.createComponent(RootCounterLab);
    fixture.detectChanges();
    const consumers = fixture.nativeElement.querySelectorAll(
      'app-root-counter-consumer output',
    ) as NodeListOf<HTMLOutputElement>;

    expect(consumers).toHaveLength(2);
    expect(consumers[0].textContent).toContain('0');
    expect(consumers[1].textContent).toContain('0');

    (fixture.nativeElement.querySelector('app-root-counter-consumer button') as HTMLButtonElement)
      .click();
    fixture.detectChanges();

    expect(consumers[0].textContent).toContain('1');
    expect(consumers[1].textContent).toContain('1');
    expect(TestBed.inject(RootCounterService).count()).toBe(1);
  });

  it('isolates state in each component provider', () => {
    const fixture = TestBed.createComponent(ComponentCounterLab);
    fixture.detectChanges();
    const counters = fixture.nativeElement.querySelectorAll(
      'app-component-counter output',
    ) as NodeListOf<HTMLOutputElement>;
    const buttons = fixture.nativeElement.querySelectorAll(
      'app-component-counter button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[0].click();
    fixture.detectChanges();

    expect(counters[0].textContent).toContain('1');
    expect(counters[1].textContent).toContain('0');
    const instances = fixture.debugElement.queryAll(By.directive(ComponentCounter));
    expect(instances[0].injector.get(ComponentCounterService)).not.toBe(
      instances[1].injector.get(ComponentCounterService),
    );
  });

  it('provides a different typed token configuration to each section', () => {
    const fixture = TestBed.createComponent(InjectionTokenLab);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Ficción');
    expect(text).toContain('8');
    expect(text).toContain('Referencia');
    expect(text).toContain('3');
  });

  it('loads and uses the lazy exporter only after the user requests it', async () => {
    const fixture = TestBed.createComponent(InjectAsyncLab);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(
        'Informe de biblioteca listo para descargar.',
      );
    });

    expect(fixture.nativeElement.textContent).not.toContain('Cargando el servicio exportador');
  });

  it('throws the normal injection error when a token has no provider', () => {
    class UnprovidedService {}

    expect(() => TestBed.inject(UnprovidedService)).toThrowError(/NG0201|No provider/);
  });

  it('renders the documentation and all labs together on the feature route', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [DependencyInjectionPage],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(DependencyInjectionPage);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const documentation = page.querySelector('.di-page__docs')?.textContent ?? '';

    expect(page.querySelector('.di-page__title')?.textContent).toContain('Dependency Injection');
    expect(documentation).toContain('NG0203');
    expect(documentation).toContain('autoProvided: false');
    expect(documentation).toContain('useFactory');
    expect(documentation).toContain('useExisting');
    expect(documentation).toContain('EnvironmentInjector');
    expect(documentation).toContain('ElementInjector');
    expect(page.querySelector('app-root-counter-lab')).toBeTruthy();
    expect(page.querySelector('app-route-counter-lab')).toBeTruthy();
    expect(page.querySelector('app-component-counter-lab')).toBeTruthy();
    expect(page.querySelector('app-injection-token-lab')).toBeTruthy();
    expect(page.querySelector('app-inject-async-lab')).toBeTruthy();
  });
});

describe('Dependency Injection route providers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('shares a route service among its consumers and isolates library from admin', async () => {
    const harness = await RouterTestingHarness.create('/dependency-injection/library');
    const libraryView = harness.fixture.debugElement.query(By.directive(LibraryRouteLab));
    const libraryService = libraryView.injector.get(RouteCounterService);
    const libraryButtons = harness.fixture.nativeElement.querySelectorAll(
      'app-library-route-lab app-route-counter-consumer button',
    ) as NodeListOf<HTMLButtonElement>;

    libraryButtons[0].click();
    harness.fixture.detectChanges();

    const libraryCounts = harness.fixture.nativeElement.querySelectorAll(
      'app-library-route-lab app-route-counter-consumer output',
    ) as NodeListOf<HTMLOutputElement>;
    expect(libraryCounts[0].textContent).toContain('1');
    expect(libraryCounts[1].textContent).toContain('1');

    await harness.navigateByUrl('/dependency-injection/admin');
    const adminView = harness.fixture.debugElement.query(By.directive(AdminRouteLab));
    const adminService = adminView.injector.get(RouteCounterService);
    const adminCounts = harness.fixture.nativeElement.querySelectorAll(
      'app-admin-route-lab app-route-counter-consumer output',
    ) as NodeListOf<HTMLOutputElement>;

    expect(adminService).not.toBe(libraryService);
    expect(adminService.count()).toBe(0);
    expect(adminCounts[0].textContent).toContain('0');
    expect(adminCounts[1].textContent).toContain('0');
    expect(libraryService.count()).toBe(1);
    expect(TestBed.inject(Router).url).toBe('/dependency-injection/admin');
  });
});
