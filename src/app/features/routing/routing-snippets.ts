export const ROUTE_LOADING_SNIPPET = `// Carga un componente para una ruta sencilla.
{ path: 'about', loadComponent: () => import('./about').then(m => m.AboutPage) }

// Carga juntas las rutas y dependencias de una funcionalidad.
{ path: 'routing', loadChildren: () => import('./routing.routes').then(m => m.ROUTING_ROUTES) }

// El outlet hijo cambia de pantalla sin desmontar RoutingPage ni el ShellComponent.
{ path: '', component: RoutingPage, children: [
  { path: 'books', component: BooksCatalog },
  { path: 'books/:id', component: BookDetail, resolve: { book: bookResolver } }
] }`;

export const RESOLVER_SNIPPET = `export const bookResolver: ResolveFn<Book> = route => {
  const book = BOOKS.find(item => item.id === route.paramMap.get('id'));
  return book ?? new RedirectCommand(inject(Router).parseUrl('/routing/books'));
};

// withComponentInputBinding() enlaza resolve.book con input.required<Book>().
readonly book = input.required<Book>();`;

export const GUARDS_SNIPPET = `export const canDeactivateNotes: CanDeactivateFn<NotesEditor> = editor =>
  !editor.hasUnsavedChanges() || inject(NOTES_CONFIRM)('¿Abandonar sin guardar?');

export const canActivateDemo: CanActivateFn = () =>
  inject(GuardDemoState).activationAllowed();

export const canMatchDemo: CanMatchFn = () =>
  inject(GuardDemoState).matchingAllowed();

// Para redirigir, devuelve un UrlTree o RedirectCommand; no navegues como efecto lateral.`;

export const PRELOADING_SNIPPET = `// NoPreloading es el comportamiento predeterminado.
provideRouter(routes, withPreloading(NoPreloading));

// Descarga todas las rutas lazy después de la navegación inicial.
provideRouter(routes, withPreloading(PreloadAllModules));

export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] === true ? load() : of(null);
  }
}

// Marca una ruta concreta: data: { preload: true }
provideRouter(routes, withPreloading(SelectivePreloadingStrategy));`;
