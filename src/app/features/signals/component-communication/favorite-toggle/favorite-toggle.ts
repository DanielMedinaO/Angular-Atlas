import { Component, model } from '@angular/core';

@Component({
  selector: 'app-favorite-toggle',
  templateUrl: './favorite-toggle.html',
  styleUrl: './favorite-toggle.scss',
})
export class FavoriteToggleComponent {
  // Bidireccional: el padre lo lee y, cuando el hijo lo cambia, el padre se actualiza.
  readonly favorite = model(false);

  protected toggle(): void {
    this.favorite.update((value) => !value);
  }
}
