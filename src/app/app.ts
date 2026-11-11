import { Component } from '@angular/core';
import { ShellComponent } from './core/shell/shell';

@Component({
  imports: [ShellComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
