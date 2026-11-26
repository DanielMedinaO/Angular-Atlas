import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssertionsPlayground } from './assertions-playground/assertions-playground';
import { SeatPicker } from './component-testing-lab/seat-picker';
import { RecommendationsLab } from './mocks-lab/recommendations-lab';
import { examples } from './testing-examples';

@Component({
  selector: 'app-testing-page',
  imports: [RouterLink, AssertionsPlayground, SeatPicker, RecommendationsLab],
  templateUrl: './testing-page.html',
  styleUrl: './testing-page.scss',
})
export class TestingPage {
  protected readonly examples = examples;
}
