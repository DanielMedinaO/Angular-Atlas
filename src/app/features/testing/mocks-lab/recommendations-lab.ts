import { Component, computed, inject, signal } from '@angular/core';
import { Recommendation, RecommendationService } from './recommendation.service';

type LabState =
  | { readonly status: 'idle' }
  | { readonly status: 'ready'; readonly topic: string; readonly items: readonly Recommendation[] }
  | { readonly status: 'empty'; readonly topic: string }
  | { readonly status: 'error' };

const TOPIC_BUTTONS = [
  { topic: 'signals', label: 'Signals' },
  { topic: 'testing', label: 'Testing' },
  { topic: 'rxjs', label: 'RxJS (sin recomendaciones)' },
  { topic: '', label: 'Tema vacío (error)' },
] as const;

@Component({
  selector: 'app-recommendations-lab',
  styleUrl: './recommendations-lab.scss',
  template: `
    <section class="recommendations" aria-labelledby="recommendations-title">
      <h3 id="recommendations-title">Recomendaciones con un servicio inyectado</h3>
      <p class="recommendations__hint">
        El componente solo conoce <code>RecommendationService</code> mediante <code>inject()</code>.
        En las pruebas se reemplaza con
        <code>&#123; provide: RecommendationService, useValue: mock &#125;</code>.
      </p>

      <div class="recommendations__actions" role="group" aria-label="Elegir tema">
        @for (option of topicButtons; track option.label) {
          <button
            type="button"
            [attr.data-testid]="'topic-' + (option.topic || 'blank')"
            (click)="load(option.topic)"
          >
            {{ option.label }}
          </button>
        }
      </div>

      <div aria-live="polite">
        @switch (state().status) {
          @case ('idle') {
            <p data-testid="idle">Elige un tema para pedir recomendaciones.</p>
          }
          @case ('empty') {
            <p data-testid="empty">No hay recomendaciones para este tema.</p>
          }
          @case ('error') {
            <p class="recommendations__error" role="alert" data-testid="error">
              No se pudieron cargar las recomendaciones.
            </p>
          }
          @case ('ready') {
            <ul class="recommendations__list" data-testid="list">
              @for (item of items(); track item.id) {
                <li>
                  <span>{{ item.title }}</span>
                  @if (readIds().has(item.id)) {
                    <span class="recommendations__read" data-testid="read-badge">Leído</span>
                  } @else {
                    <button
                      type="button"
                      [attr.data-testid]="'read-' + item.id"
                      (click)="markAsRead(item)"
                    >
                      Marcar como leído
                    </button>
                  }
                </li>
              }
            </ul>
          }
        }
      </div>
    </section>
  `,
})
export class RecommendationsLab {
  private readonly service = inject(RecommendationService);

  protected readonly topicButtons = TOPIC_BUTTONS;
  protected readonly state = signal<LabState>({ status: 'idle' });
  protected readonly readIds = signal<ReadonlySet<string>>(new Set());

  protected readonly items = computed(() => {
    const state = this.state();
    return state.status === 'ready' ? state.items : [];
  });

  protected load(topic: string): void {
    try {
      const items = this.service.recommend(topic);
      this.state.set(
        items.length > 0 ? { status: 'ready', topic, items } : { status: 'empty', topic },
      );
    } catch {
      this.state.set({ status: 'error' });
    }
  }

  protected markAsRead(item: Recommendation): void {
    this.service.markAsRead(item.id);
    this.readIds.update((ids) => new Set(ids).add(item.id));
  }
}
