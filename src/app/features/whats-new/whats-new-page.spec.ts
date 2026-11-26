import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';

describe('Novedades de Angular', () => {
  let harness: RouterTestingHarness;
  let page: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    harness = await RouterTestingHarness.create('/whats-new');
    page = harness.routeNativeElement!;
  });

  function select(element: HTMLSelectElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('change'));
    harness.detectChanges();
  }

  it('carga la página desde la ruta lazy y preserva los destinos anteriores', async () => {
    expect(routes.find((route) => route.path === 'whats-new')?.loadComponent).toBeDefined();
    expect(page.querySelector('h1')?.textContent).toBe('Novedades de Angular');
    expect(
      [...page.querySelectorAll('h2')]
        .slice(0, 4)
        .map((heading) => heading.textContent?.match(/Laboratorio [A-D]/)?.[0]),
    ).toEqual(['Laboratorio A', 'Laboratorio B', 'Laboratorio C', 'Laboratorio D']);

    const previousRoutes = [
      ['/', '/'],
      ['/components', '/components'],
      ['/signals', '/signals'],
      ['/routing', '/routing/books'],
      ['/dependency-injection', '/dependency-injection/library'],
      ['/http', '/http'],
      ['/forms', '/forms'],
      ['/testing', '/testing'],
      ['/performance', '/performance'],
    ];
    for (const [path, destination] of previousRoutes) {
      await harness.navigateByUrl(path);
      expect(TestBed.inject(Router).url).toBe(destination);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBeTruthy();
      expect(harness.routeNativeElement?.tagName).not.toBe('APP-WHATS-NEW-PAGE');
    }
  });

  it('muestra los cuatro estados, enlaces y fecha de verificación', () => {
    const radar = page.querySelector('app-release-radar')!;
    for (const status of [
      'Estable',
      'Vista previa para desarrolladores',
      'Experimental',
      'Obsoleta',
    ]) {
      expect(
        [...radar.querySelectorAll('article p')].some((item) => item.textContent?.includes(status)),
      ).toBe(true);
    }
    expect(radar.querySelector('time')?.dateTime).toBe('2026-11-26');
    expect(radar.querySelector('article a[href^="https://"]')).not.toBeNull();
    expect(radar.querySelector('article a[href="/forms"]')).not.toBeNull();
  });

  it('combina búsqueda sin tildes, estado y versión', () => {
    const radar = page.querySelector('app-release-radar')!;
    const [status, version] = radar.querySelectorAll('select');
    const search = radar.querySelector('input')!;
    const names = () => [...radar.querySelectorAll('article h3')].map((item) => item.textContent);
    search.value = '  COMENTARIOS  ';
    search.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(names()).toEqual(['Comentarios dentro de la etiqueta de apertura']);
    select(status, 'experimental');
    expect(names()).toEqual([]);
    expect(radar.querySelector('[role=status]')?.textContent).toContain('0 resultados');
    search.value = '';
    search.dispatchEvent(new Event('input'));
    select(version, '22.0');
    expect(names()).toEqual(['WebMCP']);
    select(version, '21.1');
    expect(names()).toEqual(['Platform Navigation API']);
    search.value = 'NAVEGACION';
    search.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(names()).toEqual(['Platform Navigation API']);
  });

  it('ejecuta los ejemplos de templates y cambia sus resultados', () => {
    const lab = page.querySelector('app-template-lab')!;
    const results = lab.querySelectorAll<HTMLElement>('[role=status]');
    lab.querySelector('button')!.click();
    lab.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
    harness.detectChanges();
    expect(results[0].textContent).toContain('1 página leída');
    expect(results[1].textContent).toContain('Signals · Router · Angular Aria');
    const [, inProgress, finished] = lab.querySelectorAll<HTMLInputElement>('input[type=radio]');
    inProgress.click();
    harness.detectChanges();
    expect(results[2].textContent).toContain('Por completar');
    expect(results[3].textContent).toContain('Lectura iniciada');
    finished.click();
    harness.detectChanges();
    expect(results[2].textContent).toContain('Lectura completada');
    expect(results[3].textContent).toContain('Lectura archivada');
    expect(results[4].hidden).toBe(false);
    expect(results[4].getAttributeNames()).not.toContain('//');
    lab.querySelectorAll<HTMLInputElement>('input[type=checkbox]')[1].click();
    harness.detectChanges();
    expect(results[4].hidden).toBe(true);
  });

  it('avanza y retrocede en la checklist', () => {
    const lab = page.querySelector('app-maintenance-lab')!;
    const firstStep = lab.querySelector('input')!;
    const status = lab.querySelector('[role=status]')!;
    expect(status.textContent).toContain('5 de 5');
    firstStep.click();
    harness.detectChanges();
    expect(status.textContent).toContain('4 de 5');
    firstStep.click();
    harness.detectChanges();
    expect(status.textContent).toContain('5 de 5');
  });

  it('asocia tabs y paneles y omite la pestaña deshabilitada al mover el foco', async () => {
    const list = page.querySelector('[role=tablist]')!;
    expect(list.getAttribute('aria-label')).toBe('Recursos de estudio');
    const [overview, disabled, practice] = list.querySelectorAll<HTMLButtonElement>('[role=tab]');
    const panels = page.querySelectorAll<HTMLElement>('[role=tabpanel]');
    for (const [index, tab] of [overview, disabled, practice].entries()) {
      expect(tab.getAttribute('aria-controls')).toBe(panels[index].id);
      expect(panels[index].getAttribute('aria-labelledby')).toBe(tab.id);
    }
    expect(overview.tabIndex).toBe(0);
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    disabled.click();
    harness.detectChanges();
    expect(overview.getAttribute('aria-selected')).toBe('true');

    overview.focus();
    overview.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      }),
    );
    await harness.fixture.whenStable();
    expect(document.activeElement).toBe(practice);
    expect(practice.getAttribute('aria-selected')).toBe('true');
    expect(overview.tabIndex).toBe(-1);
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(true);
    expect(panels[2].hidden).toBe(false);
    expect(panels[2].tabIndex).toBe(0);
  });
});
