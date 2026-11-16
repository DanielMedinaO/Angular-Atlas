import { TestBed } from '@angular/core/testing';
import { ComponentsPage } from './components-page';

describe('ComponentsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ComponentsPage] }).compileComponents();
  });

  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ComponentsPage);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render the title and the lifecycle lab in the same view', async () => {
    const compiled = await render();

    expect(compiled.querySelector('.components-page__title')?.textContent).toContain(
      'Componentes y ciclo de vida',
    );
    expect(compiled.querySelector('.components-page__lab app-lifecycle-lab')).toBeTruthy();
    expect(compiled.querySelectorAll('.components-page__docs').length).toBeGreaterThan(1);
  });

  it('should document the lifecycle in an accessible table', async () => {
    const compiled = await render();
    const table = compiled.querySelector('table.components-page__table')!;
    const hooks = Array.from(table.querySelectorAll('tbody th')).map((el) => el.textContent?.trim());

    expect(table.querySelector('caption')).toBeTruthy();
    expect(table.querySelectorAll('thead th[scope="col"]')).toHaveLength(4);
    expect(hooks).toEqual(
      expect.arrayContaining([
        'constructor',
        'ngOnChanges',
        'ngOnInit',
        'ngAfterContentInit',
        'ngAfterViewChecked',
        'afterNextRender',
        'ngOnDestroy / DestroyRef',
      ]),
    );
  });

  it('should explain every required topic', async () => {
    const text = (await render()).textContent ?? '';

    for (const topic of [
      'ngOnChanges()',
      'ngAfterContentInit()',
      'ngAfterViewInit()',
      'DestroyRef',
      'viewChild()',
      'viewChildren()',
      'contentChild()',
      'contentChildren()',
      'ng-content',
      'afterNextRender()',
      'ngAfterContentChecked',
      '@ViewChild',
      '@ContentChild',
    ]) {
      expect(text).toContain(topic);
    }
  });

  it('should show code blocks adapted from the implemented components', async () => {
    const compiled = await render();
    const blocks = Array.from(compiled.querySelectorAll('.components-page__code pre code')).map(
      (el) => el.textContent ?? '',
    );

    expect(blocks).toHaveLength(11);
    expect(blocks.some((code) => code.includes('afterNextRender({'))).toBe(true);
    expect(blocks.some((code) => code.includes('contentChild(ReadingPanelTitle)'))).toBe(true);
    expect(blocks.some((code) => code.includes('<ng-content select="[readingPanelTitle]" />'))).toBe(
      true,
    );
    expect(blocks.some((code) => code.includes('@ViewChild'))).toBe(true);
  });

  it('should include practical exercises', async () => {
    const compiled = await render();

    expect(compiled.querySelectorAll('.components-page__docs ol li').length).toBeGreaterThan(2);
  });
});
