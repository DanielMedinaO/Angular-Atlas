import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookExplorer } from './book-explorer/book-explorer';
import { ComponentCommunicationComponent } from './component-communication/component-communication';
import { CounterDemoComponent } from './counter-demo/counter-demo';
import {
  BOOK_EXPLORER_SNIPPET,
  COMPONENT_COMMUNICATION_SNIPPET,
  INPUT_API_SNIPPET,
  LEGACY_COMMUNICATION_SNIPPET,
  LINKED_VS_COMPUTED_SNIPPET,
  MODEL_API_SNIPPET,
  OUTPUT_API_SNIPPET,
  SIGNAL_BASICS_SNIPPET,
  SIGNALS_VS_RXJS_SNIPPET,
} from './signals-page.snippets';

@Component({
  selector: 'app-signals-page',
  imports: [CounterDemoComponent, BookExplorer, ComponentCommunicationComponent, RouterLink],
  templateUrl: './signals-page.html',
  styleUrl: './signals-page.scss',
})
export class SignalsPage {
  protected readonly signalBasicsSnippet = SIGNAL_BASICS_SNIPPET;
  protected readonly bookExplorerSnippet = BOOK_EXPLORER_SNIPPET;
  protected readonly linkedVsComputedSnippet = LINKED_VS_COMPUTED_SNIPPET;
  protected readonly signalsVsRxjsSnippet = SIGNALS_VS_RXJS_SNIPPET;
  protected readonly inputApiSnippet = INPUT_API_SNIPPET;
  protected readonly outputApiSnippet = OUTPUT_API_SNIPPET;
  protected readonly modelApiSnippet = MODEL_API_SNIPPET;
  protected readonly legacyCommunicationSnippet = LEGACY_COMMUNICATION_SNIPPET;
  protected readonly componentCommunicationSnippet = COMPONENT_COMMUNICATION_SNIPPET;
}
