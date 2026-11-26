import { edit, render, select } from '../shared/lab-test-helpers';
import { ControlFlowLab } from './control-flow-lab';

describe('ControlFlowLab', () => {
  it('renders filtered, conditional and status branches while preserving book identity', async () => {
    const { root, settle } = await render(ControlFlowLab);
    select(root.querySelector('select')!, 'tecnica');
    await settle();
    const row = root.querySelector('li')!;
    expect(root.querySelectorAll('li')).toHaveLength(1);
    expect(row.textContent).toContain('Técnica');
    expect(row.textContent).toContain('En lectura');

    root.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    row.querySelector('button')!.click();
    await settle();
    expect(root.querySelector('li')).toBe(row);
    expect(row.textContent).toContain('Categoría oculta');
    expect(row.textContent).toContain('Terminado');

    row.querySelector('button')!.click();
    await settle();
    expect(row.textContent).toContain('Pendiente');
  });

  it('adds a trimmed title to the filtered category and returns focus after deleting', async () => {
    const { root, settle } = await render(ControlFlowLab);
    select(root.querySelector('select')!, 'tecnica');
    const field = root.querySelector<HTMLInputElement>('#new-book')!;
    const add = root.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    edit(field, '   ');
    await settle();
    expect(add.disabled).toBe(true);

    edit(field, '  Angular Atlas  ');
    await settle();
    add.click();
    await settle();
    expect(field.value).toBe('');
    expect(document.activeElement).toBe(field);
    expect(root.querySelectorAll('li')).toHaveLength(2);
    expect(root.querySelector('li:last-child strong')?.textContent).toBe('Angular Atlas');
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Se agregó');

    root
      .querySelectorAll<HTMLButtonElement>('button[aria-label^="Eliminar"]')
      .forEach((button) => button.click());
    await settle();
    expect(root.querySelector('li')?.textContent).toContain('No hay libros');
    expect(document.activeElement).toBe(field);
  });
});
