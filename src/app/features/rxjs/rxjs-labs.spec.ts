import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AngularLab, RxjsClock } from './angular-lab';
import { OperatorLab } from './operator-lab';
import { SubjectLab } from './subject-lab';
import { TimelineLab } from './timeline-lab';

describe('Laboratorios de RxJS', () => {
  afterEach(() => vi.useRealTimers());

  it('emite, pausa, reanuda y completa desde el productor', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const fixture = TestBed.createComponent(TimelineLab);
    const lab = fixture.componentInstance;

    lab.start();
    vi.advanceTimersByTime(600);
    lab.pauseOrResume();
    vi.advanceTimersByTime(1800);
    expect(lab['entries']()).toEqual(['next(1)']);
    lab.pauseOrResume();
    vi.advanceTimersByTime(600);
    lab.finish();
    vi.advanceTimersByTime(600);
    expect(lab['entries']()).toEqual(['next(1)', 'next(2)', 'complete · flujo completado']);
  });

  it('completa naturalmente tras doce emisiones', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const lab = TestBed.createComponent(TimelineLab).componentInstance;
    lab.start();
    vi.advanceTimersByTime(8000);
    expect(lab['entries']()).toHaveLength(13);
    expect(lab['entries']().slice(-2)).toEqual(['next(12)', 'complete · flujo completado']);
  });

  it('distingue cancelar, recibir un error y destruir el componente', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const fixture = TestBed.createComponent(TimelineLab);
    const lab = fixture.componentInstance;

    lab.start();
    lab.cancel();
    vi.advanceTimersByTime(1200);
    expect(lab['entries']()).toEqual(['unsubscribe · suscripción cancelada']);

    lab.start();
    lab.fail();
    vi.advanceTimersByTime(1200);
    expect(lab['entries']()).toEqual(['error · Error simulado']);

    lab.start();
    vi.advanceTimersByTime(600);
    fixture.destroy();
    vi.advanceTimersByTime(1200);
    expect(lab['entries']()).toEqual(['next(1)']);
  });

  it('reinicia las gráficas en curso y conserva los intervalos seleccionados', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });
    const fixture = TestBed.createComponent(OperatorLab);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const [waitB, waitC] = host.querySelectorAll('select');
    waitB.value = '600';
    waitC.value = '700';
    const buttons = Array.from(host.querySelectorAll('button'));
    const emit = buttons.find((button) => button.textContent?.includes('Emitir A, B y C'))!;
    const reset = buttons.find((button) => button.textContent?.includes('Reiniciar gráficas'))!;

    emit.click();
    vi.advanceTimersByTime(100);
    fixture.detectChanges();
    expect(host.querySelectorAll('.bar')).toHaveLength(4);

    reset.click();
    vi.advanceTimersByTime(3000);
    fixture.detectChanges();
    expect(host.querySelectorAll('.bar, ol li')).toHaveLength(0);
    expect(emit.getAttribute('aria-disabled')).toBe('false');
    expect([waitB.value, waitC.value]).toEqual(['600', '700']);

    emit.click();
    vi.advanceTimersByTime(100);
    fixture.detectChanges();
    expect(host.querySelectorAll('.bar')).toHaveLength(4);
    fixture.destroy();
  });

  it('reproduce los valores esperados según el Subject y retira suscriptores', () => {
    const lab = TestBed.createComponent(SubjectLab).componentInstance;
    lab.add();
    expect(lab['listeners']()[0].values).toEqual({
      Subject: [],
      BehaviorSubject: [0],
      ReplaySubject: [],
    });
    lab.emit();
    lab.emit();
    lab.emit();
    lab.add();
    expect(lab['listeners']()[1].values).toEqual({
      Subject: [],
      BehaviorSubject: [3],
      ReplaySubject: [2, 3],
    });
    lab.remove(1);
    lab.emit();
    expect(lab['listeners']()[0].values.Subject).toEqual([1, 2, 3]);
    expect(lab['listeners']()[1].values).toEqual({
      Subject: [4],
      BehaviorSubject: [3, 4],
      ReplaySubject: [2, 3, 4],
    });
    lab.reset();
    lab.add();
    expect(lab['listeners']()[0].values).toEqual({
      Subject: [],
      BehaviorSubject: [0],
      ReplaySubject: [],
    });
  });

  it('libera el intervalo del reloj con takeUntilDestroyed', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const fixture = TestBed.createComponent(RxjsClock);
    const clock = fixture.componentInstance;
    vi.advanceTimersByTime(500);
    expect(clock['ticks']()).toBe(1);
    fixture.destroy();
    vi.advanceTimersByTime(1000);
    expect(clock['ticks']()).toBe(1);
  });

  it('agrupa cambios síncronos y muestra el valor estabilizado con async y toSignal', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(AngularLab);
    const lab = fixture.componentInstance;
    await fixture.whenStable();

    lab.burst();
    expect(lab['value']()).toBe(3);
    expect(lab['latest']()).toBe(0);
    await fixture.whenStable();
    expect(lab['latest']()).toBe(3);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Historial con async · 0 → 3',
    );
  });

  it('inicia HttpClient desde async y cancela una petición al destruir la vista', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(AngularLab);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectNone('atlas-data/rxjs.json');

    fixture.componentInstance.load();
    fixture.detectChanges();
    http.expectOne('atlas-data/rxjs.json').flush({ lesson: 'RxJS de prueba' });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('RxJS de prueba');

    fixture.componentInstance.load();
    fixture.detectChanges();
    const pending = http.expectOne('atlas-data/rxjs.json');
    fixture.destroy();
    expect(pending.cancelled).toBe(true);
    http.verify();
  });
});
