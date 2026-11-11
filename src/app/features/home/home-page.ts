import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TopicCard {
  readonly title: string;
  readonly description: string;
  readonly path?: string;
  readonly comingSoon?: boolean;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly topics: readonly TopicCard[] = [
    {
      title: 'Signals',
      description: 'Estado reactivo granular con signal() y computed(), sin Zone.js.',
      path: '/signals',
    },
    {
      title: 'Computed avanzado',
      description: 'Derivaciones encadenadas y memoización de estado reactivo.',
      comingSoon: true,
    },
    {
      title: 'RxJS interop',
      description: 'Puentes entre observables y signals para flujos asíncronos.',
      comingSoon: true,
    },
  ];
}
