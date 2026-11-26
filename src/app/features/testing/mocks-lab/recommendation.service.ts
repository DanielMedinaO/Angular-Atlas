import { Service } from '@angular/core';

export interface Recommendation {
  readonly id: string;
  readonly title: string;
}

const CATALOG: Readonly<Record<string, readonly Recommendation[]>> = {
  signals: [
    { id: 'signals-1', title: 'Signals en la práctica' },
    { id: 'signals-2', title: 'Estado derivado con computed()' },
  ],
  testing: [{ id: 'testing-1', title: 'Pruebas de componentes con TestBed' }],
};

// Servicio local de demostración: no autentica ni llama a ningún backend.
@Service()
export class RecommendationService {
  private readonly readIds = new Set<string>();

  recommend(topic: string): readonly Recommendation[] {
    const normalizedTopic = topic.trim().toLowerCase();
    if (!normalizedTopic) {
      throw new RangeError('El tema no puede estar vacío.');
    }
    return CATALOG[normalizedTopic] ?? [];
  }

  markAsRead(id: string): boolean {
    const isNew = !this.readIds.has(id);
    this.readIds.add(id);
    return isNew;
  }
}
