import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FavoriteToggleComponent } from './favorite-toggle';

@Component({
  imports: [FavoriteToggleComponent],
  template: `<app-favorite-toggle [(favorite)]="isFavorite" />`,
})
class HostComponent {
  readonly isFavorite = signal(false);
}

describe('FavoriteToggleComponent', () => {
  async function create() {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button',
    )!;
    return { fixture, button };
  }

  it('should expose aria-pressed reflecting the initial state', async () => {
    const { button } = await create();

    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('should update the parent signal when the child toggles (child → parent)', async () => {
    const { fixture, button } = await create();

    button.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.isFavorite()).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.isFavorite()).toBe(false);
  });

  it('should reflect parent changes in the child (parent → child)', async () => {
    const { fixture, button } = await create();

    fixture.componentInstance.isFavorite.set(true);
    await fixture.whenStable();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.classList).toContain('favorite-toggle--active');
  });
});
