import { Component } from '@angular/core';
import { CounterDemoComponent } from './counter-demo/counter-demo';

@Component({
  selector: 'app-signals-page',
  imports: [CounterDemoComponent],
  templateUrl: './signals-page.html',
  styleUrl: './signals-page.scss',
})
export class SignalsPage {}
