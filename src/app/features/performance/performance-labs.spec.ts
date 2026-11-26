import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { ChangeDetectionLab } from './change-detection-lab/change-detection-lab';
import { DeferLab } from './defer-lab/defer-lab';
import { ListRenderingLab } from './list-rendering-lab/list-rendering-lab';

describe('Change Detection Explorer', () => {
  it('refreshes the Eager child when the parent is checked and skips the clean OnPush child', async () => {
    const fixture = TestBed.createComponent(ChangeDetectionLab);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    const onPush = host.querySelector('app-on-push-counter .evaluation-value')!;
    const eager = host.querySelector('app-eager-counter .evaluation-value')!;
    const onPushBefore = Number(onPush.textContent);
    const eagerBefore = Number(eager.textContent);

    host.querySelector('button')!.click();
    await fixture.whenStable();

    expect(host.querySelector('.parent-metrics dd')?.textContent).toBe('1');
    expect(Number(onPush.textContent)).toBe(onPushBefore);
    expect(Number(eager.textContent)).toBeGreaterThan(eagerBefore);
  });

  it('updates the local signal and its computed value without changing the sibling state', async () => {
    const fixture = TestBed.createComponent(ChangeDetectionLab);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    const onPush = host.querySelector('app-on-push-counter')!;
    const eager = host.querySelector('app-eager-counter')!;

    onPush.querySelector('button')!.click();
    await fixture.whenStable();

    expect(Array.from(onPush.querySelectorAll('dd'), (metric) => metric.textContent)).toEqual([
      '1',
      '24',
    ]);
    expect(Array.from(eager.querySelectorAll('dd'), (metric) => metric.textContent)).toEqual([
      '0',
      '0',
    ]);
    expect(Number(onPush.querySelector('.evaluation-value')!.textContent)).toBeGreaterThan(0);
  });
});

describe('List Rendering', () => {
  async function render() {
    const fixture = TestBed.createComponent(ListRenderingLab);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    return { fixture, host };
  }

  function rows(host: HTMLElement, tracking: 'id' | 'index'): HTMLLIElement[] {
    return Array.from(
      host.querySelectorAll(`[aria-labelledby="performance-track-${tracking}"] li`),
    );
  }

  it('keeps state on the book by ID and on the position by index during reordering', async () => {
    const { fixture, host } = await render();
    const [idFirst, , idLast] = rows(host, 'id');
    const [indexFirst] = rows(host, 'index');
    expect(idFirst.textContent).toContain('Angular en acción');
    expect(indexFirst.textContent).toContain('Angular en acción');
    idFirst.querySelector('button')!.click();
    indexFirst.querySelector('button')!.click();

    const reverse = Array.from(host.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Invertir orden',
    )!;
    reverse.click();
    await fixture.whenStable();

    const byId = rows(host, 'id');
    const byIndex = rows(host, 'index');
    expect(byId[0]).toBe(idLast);
    expect(byId[2]).toBe(idFirst);
    expect(byId[2].querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
    expect(byIndex[0]).toBe(indexFirst);
    expect(byIndex[0].textContent).toContain('Diseño web accesible');
    expect(byIndex[0].querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
    expect(byIndex[2].querySelector('button')!.getAttribute('aria-pressed')).toBe('false');
    expect(host.textContent?.match(/Creadas: 3 · Destruidas: 0/g)).toHaveLength(2);
  });

  it('adds and removes entries in both lists and renders the computed filter', async () => {
    const { fixture, host } = await render();
    host.querySelector('button')!.click();
    await fixture.whenStable();

    expect(rows(host, 'id')).toHaveLength(4);
    expect(rows(host, 'index')[3].textContent).toContain('Cuaderno de lectura 4');

    rows(host, 'id')[3].querySelector<HTMLButtonElement>('[aria-label^="Eliminar"]')!.click();
    await fixture.whenStable();

    expect(rows(host, 'id')).toHaveLength(3);
    expect(rows(host, 'index')).toHaveLength(3);
    expect(host.textContent?.match(/Creadas: 4 · Destruidas: 1/g)).toHaveLength(2);

    const filter = host.querySelector('input')!;
    filter.value = 'ANGULAR';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(rows(host, 'id')).toHaveLength(1);
    expect(rows(host, 'index')[0].textContent).toContain('Angular en acción');
    expect(host.querySelector('[role="status"]')!.textContent).toContain('1 títulos visibles de 3');
  });
});

describe('Carga diferida', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ deferBlockBehavior: DeferBlockBehavior.Manual });
  });

  it('shows a recovery message when the deferred dependency fails', async () => {
    const fixture = TestBed.createComponent(DeferLab);
    await fixture.whenStable();
    const [block] = await fixture.getDeferBlocks();

    await block.render(DeferBlockState.Error);

    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('No se pudo cargar');
    expect(host.querySelector('app-performance-reading-chart')).toBeNull();
  });

  it.each(['interaction', 'idle'])('renders the manual states for %s', async (scenario) => {
    const fixture = TestBed.createComponent(DeferLab);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    const select = host.querySelector('select')!;
    select.value = scenario;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    const [block] = await fixture.getDeferBlocks();

    await block.render(DeferBlockState.Placeholder);
    expect(host.textContent).toContain('Gráfico pendiente');
    expect(host.querySelector('app-performance-reading-chart')).toBeNull();

    await block.render(DeferBlockState.Loading);
    expect(host.textContent).toContain('Cargando gráfico');

    await block.render(DeferBlockState.Complete);
    const chart = host.querySelector('app-performance-reading-chart')!;
    expect(chart.textContent).toContain('datos simulados');
    const canvas = chart.querySelector('canvas[role="img"]')!;
    expect(canvas.getAttribute('aria-label')).toContain('Gráfico de anillo');
    expect(chart.querySelectorAll('.metrics dt')).toHaveLength(3);
    expect(chart.textContent).toContain('365 días · 3 categorías');
    expect(chart.querySelectorAll('tbody tr')).toHaveLength(15);

    const next = Array.from(chart.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Siguiente',
    )!;
    next.click();
    await fixture.whenStable();
    expect(chart.textContent).toContain('Página 2 de 25');

    const [range, type] = chart.querySelectorAll('select');
    type.value = 'pie';
    type.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    expect(canvas.getAttribute('aria-label')).toContain('Gráfico de pastel');
    expect(chart.querySelector('.center-total')).toBeNull();

    range.value = '30';
    range.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    expect(chart.textContent).toContain('30 días · 3 categorías · 90 valores diarios');
    expect(chart.textContent).toContain('Página 1 de 2');
  });
});
