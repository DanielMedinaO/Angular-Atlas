import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs';

export const requestLoggingInterceptor: HttpInterceptorFn = (request, next) => {
  const startedAt = Date.now();
  let status: number | 'sin respuesta' = 'sin respuesta';

  return next(request).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          status = event.status;
        }
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          status = error.status;
        }
      },
    }),
    finalize(() => {
      console.info('[Atlas HTTP]', {
        method: request.method,
        url: request.url,
        status,
        elapsedMs: Math.max(0, Date.now() - startedAt),
      });
    }),
  );
};
