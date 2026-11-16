import { Component } from '@angular/core';
import { BookExplorer } from './book-explorer/book-explorer';
import { CounterDemoComponent } from './counter-demo/counter-demo';
import {
  BOOK_EXPLORER_SNIPPET,
  LINKED_VS_COMPUTED_SNIPPET,
  SIGNAL_BASICS_SNIPPET,
  SIGNALS_VS_RXJS_SNIPPET,
} from './signals-page.snippets';

@Component({
  selector: 'app-signals-page',
  imports: [CounterDemoComponent, BookExplorer],
  templateUrl: './signals-page.html',
  styleUrl: './signals-page.scss',
})
export class SignalsPage {
  protected readonly signalBasicsSnippet = SIGNAL_BASICS_SNIPPET;
  protected readonly bookExplorerSnippet = BOOK_EXPLORER_SNIPPET;
  protected readonly linkedVsComputedSnippet = LINKED_VS_COMPUTED_SNIPPET;
  protected readonly signalsVsRxjsSnippet = SIGNALS_VS_RXJS_SNIPPET;
}
