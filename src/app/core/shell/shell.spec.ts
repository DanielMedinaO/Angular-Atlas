import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellComponent } from './shell';

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the primary navigation links', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('.shell__nav-link'));

    expect(links).toHaveLength(2);
    expect(links[0].textContent).toContain('Inicio');
    expect(links[1].textContent).toContain('Signals');
  });

  it('should toggle the sidebar open state for mobile navigation', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance['sidebarOpen']()).toBe(false);

    const toggle = compiled.querySelector<HTMLButtonElement>('.shell__menu-toggle');
    toggle?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance['sidebarOpen']()).toBe(true);
    expect(compiled.querySelector('.shell__backdrop')).toBeTruthy();
  });
});
