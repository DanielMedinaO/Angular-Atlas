import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LifecycleLab } from './lifecycle-lab';

describe('LifecycleLab', () => {
  let fixture: ComponentFixture<LifecycleLab>;

  const root = () => fixture.nativeElement as HTMLElement;
  const button = (text: string) =>
    Array.from(root().querySelectorAll<HTMLButtonElement>('.lifecycle-lab__button')).find((el) =>
      el.textContent?.includes(text),
    )!;
  const loggedHooks = () =>
    Array.from(root().querySelectorAll('.lifecycle-lab__hook')).map((el) => el.textContent?.trim());
  const queryValue = (label: string) =>
    Array.from(root().querySelectorAll('.lifecycle-lab__query'))
      .find((el) => el.querySelector('dt')?.textContent?.includes(label))
      ?.querySelector('dd')
      ?.textContent?.trim();

  async function click(target: HTMLButtonElement): Promise<void> {
    target.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 480,
      height: 120,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 480,
      bottom: 120,
      toJSON: () => ({}),
    });

    await TestBed.configureTestingModule({ imports: [LifecycleLab] }).compileComponents();
    fixture = TestBed.createComponent(LifecycleLab);
    await fixture.whenStable();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should start without a panel and with an empty log', () => {
    expect(root().querySelector('app-reading-panel')).toBeNull();
    expect(root().querySelector('.lifecycle-lab__empty')).toBeTruthy();
    expect(button('Destruir').disabled).toBe(true);
    expect(queryValue('viewChild(ReadingPanel)')).toBe('undefined');
  });

  it('should create the panel with @if and log the creation hooks in order', async () => {
    await click(button('Crear panel'));

    expect(root().querySelector('app-reading-panel')).toBeTruthy();
    expect(button('Crear panel').disabled).toBe(true);
    expect(loggedHooks()).toEqual([
      'ngOnChanges',
      'ngOnChanges',
      'ngOnInit',
      'ngAfterContentInit',
      'ngAfterViewInit',
      'afterNextRender',
    ]);
  });

  it('should destroy the panel and keep the log visible with the destruction events', async () => {
    await click(button('Crear panel'));
    await click(button('Destruir panel'));

    expect(root().querySelector('app-reading-panel')).toBeNull();
    expect(loggedHooks()).toContain('ngOnDestroy');
    expect(loggedHooks()).toContain('DestroyRef.onDestroy');
    expect(queryValue('viewChild(ReadingPanel)')).toBe('undefined');
    expect(root().querySelector('.lifecycle-lab__empty')).toBeNull();
  });

  it('should show the viewChild results while the panel exists', async () => {
    await click(button('Crear panel'));

    expect(queryValue('viewChild(ReadingPanel)')).toBe('ReadingPanel #1');
    expect(queryValue("viewChild('surface')")).toContain('encontrado');
    expect(queryValue('contentChild(ReadingPanelTitle)')).toContain('encontrado');
  });

  it('should show the initial width measured after render', async () => {
    expect(queryValue('Ancho inicial')).toBe('—');

    await click(button('Crear panel'));

    expect(queryValue('Ancho inicial')).toBe('480 px');
    expect(root().querySelector('.reading-panel__status')?.textContent).toContain('480 px');
  });

  it('should log ngOnChanges when the panel input changes', async () => {
    await click(button('Crear panel'));
    await click(button('Densidad'));

    const details = Array.from(root().querySelectorAll('.lifecycle-lab__detail')).map((el) =>
      el.textContent?.trim(),
    );
    expect(details).toContain('density: comfortable → compact');
    expect(root().querySelector('.reading-panel--compact')).toBeTruthy();
  });

  it('should update contentChild() when the projected title is hidden and shown again', async () => {
    await click(button('Crear panel'));
    await click(button('Título proyectado'));

    expect(root().querySelector('h3[readingPanelTitle]')).toBeNull();
    expect(queryValue('contentChild(ReadingPanelTitle)')).toBe('undefined');
    expect(root().querySelector('.reading-panel__status')?.textContent).toContain('no (undefined)');
    expect(button('Título proyectado').getAttribute('aria-pressed')).toBe('false');

    await click(button('Título proyectado'));

    expect(root().querySelector('h3[readingPanelTitle]')).toBeTruthy();
    expect(queryValue('contentChild(ReadingPanelTitle)')).toContain('encontrado');
  });

  it('should project the title and the main content into the panel', async () => {
    await click(button('Crear panel'));

    expect(root().querySelector('.reading-panel__header h3')?.textContent).toContain(
      'Lectura recomendada #1',
    );
    expect(root().querySelector('.reading-panel__body p')?.textContent).toContain('slot principal');
  });

  it('should identify every created instance with its own id and keep older events', async () => {
    await click(button('Crear panel'));
    await click(button('Destruir panel'));
    await click(button('Crear panel'));

    const instances = new Set(
      Array.from(root().querySelectorAll('.lifecycle-lab__instance')).map((el) =>
        el.textContent?.trim(),
      ),
    );
    const hues = new Set(
      Array.from(root().querySelectorAll<HTMLElement>('.lifecycle-lab__event')).map((el) =>
        el.style.getPropertyValue('--instance-hue'),
      ),
    );

    expect(instances).toEqual(new Set(['#1', '#2']));
    expect(hues.size).toBe(2);
    expect(queryValue('viewChild(ReadingPanel)')).toBe('ReadingPanel #2');
  });

  it('should not log the Checked hooks', async () => {
    await click(button('Crear panel'));
    await click(button('Densidad'));

    expect(loggedHooks().some((hook) => hook?.includes('Checked'))).toBe(false);
  });

  it('should clear the event history', async () => {
    await click(button('Crear panel'));
    expect(root().querySelectorAll('.lifecycle-lab__event').length).toBeGreaterThan(0);

    await click(button('Limpiar historial'));

    expect(root().querySelectorAll('.lifecycle-lab__event')).toHaveLength(0);
    expect(root().querySelector('.lifecycle-lab__empty')).toBeTruthy();
    expect(root().querySelector('app-reading-panel')).toBeTruthy();
  });

  it('should show full-width labelled groups and align clear history with the event log heading', () => {
    const groups = Array.from(root().querySelectorAll('.lifecycle-lab__group'));
    const groupButtons = groups.map((group) =>
      Array.from(group.querySelectorAll('button')).map((el) => el.textContent?.trim()),
    );
    const clear = button('Limpiar historial');
    const logHeading = root().querySelector('.lifecycle-lab__section-heading')!;

    expect(groups).toHaveLength(2);
    expect(groups.every((group) => group.getAttribute('role') === 'group')).toBe(true);
    expect(groups.every((group) => root().querySelector(`#${group.getAttribute('aria-labelledby')}`))).toBe(
      true,
    );
    expect(groups.map((group) => group.classList.contains('lifecycle-lab__group'))).toEqual([
      true,
      true,
    ]);
    expect(groupButtons[0]).toEqual(['Crear panel', 'Destruir panel']);
    expect(groupButtons[1]).toEqual([
      'Título proyectado: visible',
      'Densidad (input): cómoda',
    ]);
    expect(clear.parentElement).toBe(logHeading);
    expect(logHeading.querySelector('#lifecycle-log-title')).toBeTruthy();
    expect(clear.classList).toContain('lifecycle-lab__button--danger');
    expect(clear.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
  });

  it('should expose the log as an accessible, focusable region', () => {
    const log = root().querySelector('.lifecycle-lab__log')!;

    expect(log.getAttribute('role')).toBe('log');
    expect(log.getAttribute('tabindex')).toBe('0');
    expect(log.getAttribute('aria-labelledby')).toBe('lifecycle-log-title');
  });
});
