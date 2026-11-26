import { Component } from '@angular/core';
import { render, select } from '../shared/lab-test-helpers';
import { DirectivesPipesLab, ReadingHighlight, ReadingTime } from './directives-pipes-lab';

@Component({
  imports: [ReadingHighlight],
  template: '<button appReadingHighlight type="button">Selección destacada</button>',
})
class HighlightHost {}

describe('DirectivesPipesLab', () => {
  it('applies the attribute directive without removing native button semantics', async () => {
    const { root } = await render(HighlightHost);
    const button = root.querySelector('button')!;
    expect(button.classList.contains('reading-highlight')).toBe(true);
    expect(button.textContent).toContain('Selección destacada');
    expect(button.tabIndex).toBe(0);
    expect(button.getAttribute('role')).toBeNull();
  });

  it('rounds estimated reading time up to a whole minute', () => {
    const pipe = new ReadingTime();
    expect(pipe.transform(0)).toBe('≈ 0 min');
    expect(pipe.transform(15)).toBe('≈ 8 min');
    expect(pipe.transform(16)).toBe('≈ 8 min');
  });

  it('renders built-in pipes and updates the custom pipe output when pages change', async () => {
    const { root, settle } = await render(DirectivesPipesLab);
    expect(root.textContent).toContain('ANGULAR EN PRÁCTICA');
    expect(root.textContent).toContain('15/01/2026');
    expect(root.textContent).toMatch(/USD\s*18\.50/);
    expect(root.textContent).toContain('≈ 8 min');

    select(root.querySelector('select')!, '60');
    await settle();
    expect(root.textContent).toContain('≈ 30 min');
  });
});
