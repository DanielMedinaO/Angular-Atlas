import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InjectAsyncLab } from './inject-async-lab';
import { InjectionTokenLab } from './injection-token-lab';
import { ComponentCounterLab } from './scope-explorer/component-counter-lab';
import { RootCounterLab } from './scope-explorer/root-counter-lab';
import { RouteCounterLab } from './scope-explorer/route-counter-lab';

@Component({
  selector: 'app-dependency-injection-page',
  imports: [
    RouterOutlet,
    RootCounterLab,
    RouteCounterLab,
    ComponentCounterLab,
    InjectionTokenLab,
    InjectAsyncLab,
  ],
  templateUrl: './dependency-injection-page.html',
  styleUrl: './dependency-injection-page.scss',
})
export class DependencyInjectionPage {}
