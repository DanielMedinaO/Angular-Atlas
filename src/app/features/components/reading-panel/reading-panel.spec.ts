import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LifecycleEvent, LifecycleLog } from '../lifecycle-log';
import { PanelDensity, ReadingPanel } from './reading-panel';
import { ReadingPanelTitle } from './reading-panel-title';

@Component({
  selector: 'app-host',
  imports: [ReadingPanel, ReadingPanelTitle],
  template: `
    @if (alive()) {
      <app-reading-panel [instanceId]="7" [density]="density()">
        @if (showTitle()) {
          <h3 readingPanelTitle>Título proyectado</h3>
        }
        <p class="body-content">Contenido principal</p>
      </app-reading-panel>
    }
  `,
})
class HostComponent {
  readonly alive = signal(true);
  readonly showTitle = signal(true);
  readonly density = signal<PanelDensity>('comfortable');
}

@Component({
  selector: 'app-bare-host',
  imports: [ReadingPanel],
  template: `<app-reading-panel [instanceId]="1" />`,
})
class BareHostComponent {}

describe('ReadingPanel', () => {
  let fixture: ComponentFixture<HostComponent>;
  let log: LifecycleLog;

  const root = () => fixture.nativeElement as HTMLElement;
  const hooks = () => log.entries().map((entry: LifecycleEvent) => entry.hook);

  async function settle(): Promise<void> {
    await fixture.whenStable();
  }

  beforeEach(async () => {
    // jsdom no calcula layout: se simula una geometría conocida para la medición.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 320.4,
      height: 100,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 320.4,
      bottom: 100,
      toJSON: () => ({}),
    });

    await TestBed.configureTestingModule({
      imports: [HostComponent, BareHostComponent],
      providers: [LifecycleLog],
    }).compileComponents();
    log = TestBed.inject(LifecycleLog);
    fixture = TestBed.createComponent(HostComponent);
    await settle();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should project the title into its slot and the rest into the default slot', () => {
    const header = root().querySelector('.reading-panel__header')!;
    const body = root().querySelector('.reading-panel__body')!;

    expect(header.querySelector('h3')?.textContent).toContain('Título proyectado');
    expect(body.querySelector('.body-content')?.textContent).toContain('Contenido principal');
    expect(body.querySelector('h3')).toBeNull();
    expect(header.querySelector('.body-content')).toBeNull();
  });

  it('should find the internal element with viewChild()', () => {
    const panel = fixture.debugElement.children[0].componentInstance as ReadingPanel;

    expect(panel.hasSurface()).toBe(true);
    expect(root().querySelector('section.reading-panel')).toBeTruthy();
  });

  it('should detect the projected title with contentChild() and link it for accessibility', () => {
    const section = root().querySelector('section.reading-panel')!;
    const title = root().querySelector('h3')!;
    const panel = fixture.debugElement.children[0].componentInstance as ReadingPanel;

    expect(panel.hasTitle()).toBe(true);
    expect(title.id).toMatch(/^reading-panel-title-/);
    expect(section.getAttribute('aria-labelledby')).toBe(title.id);
    expect(section.hasAttribute('aria-label')).toBe(false);
    expect(root().querySelector('.reading-panel__header')?.hasAttribute('hidden')).toBe(false);
  });

  it('should handle an undefined contentChild() when the title disappears', async () => {
    const panel = fixture.debugElement.children[0].componentInstance as ReadingPanel;

    fixture.componentInstance.showTitle.set(false);
    await settle();

    const section = root().querySelector('section.reading-panel')!;
    expect(panel.hasTitle()).toBe(false);
    expect(root().querySelector('h3')).toBeNull();
    expect(section.hasAttribute('aria-labelledby')).toBe(false);
    expect(section.getAttribute('aria-label')).toBe('Panel de lectura');
    expect(root().querySelector('.reading-panel__header')?.hasAttribute('hidden')).toBe(true);
    expect(root().querySelector('.reading-panel__body')?.textContent).toContain('Contenido principal');

    fixture.componentInstance.showTitle.set(true);
    await settle();

    expect(panel.hasTitle()).toBe(true);
  });

  it('should log creation hooks in lifecycle order, with afterNextRender last', () => {
    expect(hooks()).toEqual([
      'ngOnChanges', // instanceId
      'ngOnChanges', // density
      'ngOnInit',
      'ngAfterContentInit',
      'ngAfterViewInit',
      'afterNextRender',
    ]);
  });

  it('should report what each hook could already query', () => {
    const details = Object.fromEntries(log.entries().map((entry) => [entry.hook, entry.detail]));

    expect(details['ngAfterContentInit']).toContain('encontrado');
    expect(details['ngAfterViewInit']).toContain('encontrado');
  });

  it('should measure the initial width after render with afterNextRender({ read })', () => {
    const panel = fixture.debugElement.children[0].componentInstance as ReadingPanel;

    expect(panel.initialWidth()).toBe(320);
    expect(root().querySelector('.reading-panel__status')?.textContent).toContain('320 px');
    expect(log.entries().find((entry) => entry.hook === 'afterNextRender')?.detail).toContain('320px');
  });

  it('should not have a measurement before the first render has completed', () => {
    const early = TestBed.createComponent(BareHostComponent);
    const panel = early.debugElement.children[0].componentInstance as ReadingPanel;

    // Sin render todavía no hay callback ejecutado: el estado inicial debe ser un valor seguro.
    expect(panel.initialWidth()).toBeNull();
  });

  it('should detect input changes with ngOnChanges', async () => {
    fixture.componentInstance.density.set('compact');
    await settle();

    const changes = log.entries().filter((entry) => entry.hook === 'ngOnChanges');
    expect(changes).toHaveLength(3);
    expect(changes.at(-1)?.detail).toBe('density: comfortable → compact');
    expect(root().querySelector('.reading-panel--compact')).toBeTruthy();
  });

  it('should not run ngOnChanges when the title toggles', async () => {
    const before = hooks().filter((hook) => hook === 'ngOnChanges').length;

    fixture.componentInstance.showTitle.set(false);
    await settle();

    expect(hooks().filter((hook) => hook === 'ngOnChanges')).toHaveLength(before);
  });

  it('should log destruction hooks when removed with @if', async () => {
    fixture.componentInstance.alive.set(false);
    await settle();

    expect(root().querySelector('app-reading-panel')).toBeNull();
    expect(hooks()).toContain('ngOnDestroy');
    expect(hooks()).toContain('DestroyRef.onDestroy');
    expect(log.entries().every((entry) => entry.instanceId === 7)).toBe(true);
  });

  it('should work without a LifecycleLog provider', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [BareHostComponent] }).compileComponents();
    const bare = TestBed.createComponent(BareHostComponent);
    await bare.whenStable();

    expect((bare.nativeElement as HTMLElement).querySelector('section.reading-panel')).toBeTruthy();
  });
});
