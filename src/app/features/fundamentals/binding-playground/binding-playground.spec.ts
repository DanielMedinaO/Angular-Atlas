import { edit, render } from '../shared/lab-test-helpers';
import { BindingPlayground } from './binding-playground';

describe('BindingPlayground', () => {
  it('propagates the title in both directions and renders interpolation', async () => {
    const { root, settle } = await render(BindingPlayground);
    const field = root.querySelector<HTMLInputElement>('#binding-title')!;
    const result = root.querySelector('[role="status"]')!;

    expect(field.value).toBe('Mi biblioteca');
    edit(field, 'Lecturas');
    await settle();
    expect(result.textContent).toContain('Lecturas');
    root.querySelector('button')!.click();
    await settle();
    expect(field.value).toBe('Mi biblioteca');
    expect(result.textContent).toContain('Mi biblioteca');
  });

  it('handles click events, disabled properties and the data-count attribute', async () => {
    const { root, settle } = await render(BindingPlayground);
    const [, increment, reset] = root.querySelectorAll('button');
    const toggle = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    const result = root.querySelector('[data-count]')!;

    increment.click();
    await settle();
    expect(result.textContent).toContain('Contador: 1');
    expect(result.getAttribute('data-count')).toBe('1');

    toggle.click();
    await settle();
    expect(increment.disabled).toBe(true);
    expect(reset.disabled).toBe(true);
    increment.click();
    await settle();
    expect(result.getAttribute('data-count')).toBe('1');

    toggle.click();
    await settle();
    expect(reset.disabled).toBe(false);
    reset.click();
    await settle();
    expect(result.getAttribute('data-count')).toBe('0');
  });
});
