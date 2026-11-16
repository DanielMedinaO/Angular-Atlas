import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItem, TOPICS } from '../../core/shell/navigation';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly topics: readonly NavItem[] = TOPICS;
}
