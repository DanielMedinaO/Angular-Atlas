import { render } from '../shared/lab-test-helpers';
import { TemplatesLab } from './templates-lab';

describe('TemplatesLab', () => {
  it('instantiates the fragment with the value read through the template reference', async () => {
    const { root, settle } = await render(TemplatesLab);
    const result = root.querySelector('[role="status"]')!;
    expect(result.textContent).not.toContain('Hola');
    const field = root.querySelector<HTMLInputElement>('input')!;
    field.value = 'Grace';
    root.querySelector('button')!.click();
    await settle();
    expect(result.firstElementChild?.textContent).toContain('Hola, Grace');
    expect(result.querySelector('ng-container')).toBeNull();
  });
});
