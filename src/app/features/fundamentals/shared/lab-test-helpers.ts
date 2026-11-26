import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export async function render<T>(component: Type<T>) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  return { root, settle: () => fixture.whenStable() };
}

export function edit(field: HTMLInputElement, value: string): void {
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

export function select(field: HTMLSelectElement, value: string): void {
  field.value = value;
  field.dispatchEvent(new Event('change', { bubbles: true }));
}
