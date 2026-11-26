import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { RecommendationsLab } from './recommendations-lab';
import { Recommendation, RecommendationService } from './recommendation.service';

type RecommendationApi = Pick<RecommendationService, 'recommend' | 'markAsRead'>;

const SIGNALS_BOOKS: readonly Recommendation[] = [
  { id: 'a', title: 'Libro A' },
  { id: 'b', title: 'Libro B' },
];

describe('RecommendationService (real implementation)', () => {
  let service: RecommendationService;

  beforeEach(() => {
    service = TestBed.inject(RecommendationService);
  });

  it('returns the recommendations of a known topic regardless of case and spaces', () => {
    expect(service.recommend('  Signals ').map((item) => item.id)).toEqual([
      'signals-1',
      'signals-2',
    ]);
  });

  it('returns an empty list for a topic without recommendations', () => {
    expect(service.recommend('rxjs')).toEqual([]);
  });

  it('rejects a blank topic', () => {
    expect(() => service.recommend('   ')).toThrow(RangeError);
  });

  it('reports whether an item was newly marked as read', () => {
    expect(service.markAsRead('signals-1')).toBe(true);
    expect(service.markAsRead('signals-1')).toBe(false);
  });
});

describe('RecommendationsLab with a mocked service', () => {
  let fixture: ComponentFixture<RecommendationsLab>;
  let host: HTMLElement;
  let service: {
    recommend: ReturnType<typeof vi.fn<RecommendationApi['recommend']>>;
    markAsRead: ReturnType<typeof vi.fn<RecommendationApi['markAsRead']>>;
  };

  const byTestId = (id: string): HTMLElement | null =>
    host.querySelector<HTMLElement>(`[data-testid="${id}"]`);
  const click = async (id: string): Promise<void> => {
    byTestId(id)!.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    service = {
      recommend: vi.fn<RecommendationApi['recommend']>().mockReturnValue(SIGNALS_BOOKS),
      markAsRead: vi.fn<RecommendationApi['markAsRead']>().mockReturnValue(true),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: RecommendationService, useValue: service }],
    });
    fixture = TestBed.createComponent(RecommendationsLab);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not call the service until the user asks for recommendations', () => {
    expect(service.recommend).not.toHaveBeenCalled();
    expect(byTestId('idle')).not.toBeNull();
  });

  it('passes the selected topic to the service and renders the returned items', async () => {
    await click('topic-signals');

    expect(service.recommend).toHaveBeenCalledOnce();
    expect(service.recommend).toHaveBeenCalledWith('signals');
    expect(host.querySelectorAll('[data-testid="list"] li')).toHaveLength(2);
    expect(host.textContent).toContain('Libro A');
  });

  it('shows the empty state when the service returns no items', async () => {
    service.recommend.mockReturnValueOnce([]);

    await click('topic-rxjs');

    expect(byTestId('empty')).not.toBeNull();
    expect(byTestId('list')).toBeNull();
  });

  it('shows an error state when the service throws, and recovers on the next success', async () => {
    service.recommend.mockImplementationOnce(() => {
      throw new Error('servicio no disponible');
    });

    await click('topic-testing');
    expect(byTestId('error')?.textContent).toContain('No se pudieron cargar');

    await click('topic-signals');
    expect(byTestId('error')).toBeNull();
    expect(byTestId('list')).not.toBeNull();
    expect(service.recommend).toHaveBeenNthCalledWith(1, 'testing');
    expect(service.recommend).toHaveBeenNthCalledWith(2, 'signals');
  });

  it('notifies the service with the item id and replaces the button with a read badge', async () => {
    await click('topic-signals');

    await click('read-a');

    expect(service.markAsRead).toHaveBeenCalledOnce();
    expect(service.markAsRead).toHaveBeenCalledWith('a');
    expect(byTestId('read-a')).toBeNull();
    expect(byTestId('read-badge')).not.toBeNull();
    expect(byTestId('read-b')).not.toBeNull();
  });

  it('keeps every test isolated: the mock starts without recorded calls', () => {
    expect(service.recommend.mock.calls).toHaveLength(0);
    expect(service.markAsRead.mock.calls).toHaveLength(0);
  });
});
