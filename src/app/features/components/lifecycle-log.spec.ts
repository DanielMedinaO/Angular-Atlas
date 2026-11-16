import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LifecycleLog, instanceHue } from './lifecycle-log';

describe('LifecycleLog', () => {
  let log: LifecycleLog;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LifecycleLog] });
    log = TestBed.inject(LifecycleLog);
  });

  it('should not publish events synchronously from record()', () => {
    log.record({ instanceId: 1, hook: 'ngOnInit', detail: 'a' });

    expect(log.entries()).toEqual([]);
  });

  it('should publish buffered events in order after the next render', () => {
    log.record({ instanceId: 1, hook: 'ngOnInit', detail: 'a' });
    log.record({ instanceId: 1, hook: 'ngAfterViewInit', detail: 'b' });
    TestBed.inject(ApplicationRef).tick();

    expect(log.entries().map((entry) => [entry.sequence, entry.hook])).toEqual([
      [1, 'ngOnInit'],
      [2, 'ngAfterViewInit'],
    ]);
  });

  it('should publish events recorded after an earlier flush', () => {
    const appRef = TestBed.inject(ApplicationRef);
    log.record({ instanceId: 1, hook: 'ngOnInit', detail: 'a' });
    appRef.tick();
    log.record({ instanceId: 1, hook: 'ngOnDestroy', detail: 'b' });
    appRef.tick();

    expect(log.entries().map((entry) => entry.hook)).toEqual(['ngOnInit', 'ngOnDestroy']);
  });

  it('should clear published and pending events', () => {
    const appRef = TestBed.inject(ApplicationRef);
    log.record({ instanceId: 1, hook: 'ngOnInit', detail: 'a' });
    appRef.tick();
    log.record({ instanceId: 1, hook: 'ngOnDestroy', detail: 'b' });
    log.clear();
    appRef.tick();

    expect(log.entries()).toEqual([]);
  });
});

describe('instanceHue', () => {
  it('should give consecutive instances different hues and be stable', () => {
    expect(instanceHue(1)).not.toBe(instanceHue(2));
    expect(instanceHue(1)).toBe(instanceHue(1));
  });
});
