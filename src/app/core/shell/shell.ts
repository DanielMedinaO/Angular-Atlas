import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly description: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent {
  protected readonly navLinks: readonly NavLink[] = [
    { label: 'Inicio', path: '/', description: 'Visión general de Angular Atlas' },
    { label: 'Signals', path: '/signals', description: 'Estado reactivo con signals' },
  ];

  protected readonly sidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
