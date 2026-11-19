import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  OPEN_LIBRARY_RESULT_LIMIT,
  OPEN_LIBRARY_SEARCH_FIELDS,
  OPEN_LIBRARY_SEARCH_URL,
  OpenLibrarySearchResponse,
  normalizeOpenLibraryResponse,
} from './open-library.model';

@Service()
export class BooksApiService {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<OpenLibrarySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('fields', OPEN_LIBRARY_SEARCH_FIELDS.join(','))
      .set('limit', OPEN_LIBRARY_RESULT_LIMIT);

    return this.http
      .get<unknown>(OPEN_LIBRARY_SEARCH_URL, { params })
      .pipe(map(normalizeOpenLibraryResponse));
  }
}
