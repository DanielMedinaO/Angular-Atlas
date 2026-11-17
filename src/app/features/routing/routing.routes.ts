import { Routes } from '@angular/router';
import { BookDetail } from './book-detail';
import { BooksCatalog } from './books-catalog';
import { canActivateDemo, canMatchDemo } from './guard-demo';
import { ActivateDemoPage, MatchDemoPage, MatchFallbackPage } from './guard-demo-pages';
import { canDeactivateNotes } from './notes-guard';
import { NotesEditor } from './notes-editor';
import { bookResolver } from './book-resolver';
import { RoutingPage } from './routing-page';

export const ROUTING_ROUTES: Routes = [
  {
    path: '',
    component: RoutingPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'books' },
      { path: 'books', component: BooksCatalog, title: 'Catálogo · Routing · Angular Atlas' },
      {
        path: 'books/:id',
        component: BookDetail,
        resolve: { book: bookResolver },
        title: 'Detalle del libro · Routing · Angular Atlas',
      },
      {
        path: 'notes',
        component: NotesEditor,
        canDeactivate: [canDeactivateNotes],
        title: 'Notas · Routing · Angular Atlas',
      },
      {
        path: 'demo/activate',
        component: ActivateDemoPage,
        canActivate: [canActivateDemo],
      },
      {
        path: 'demo/match',
        component: MatchDemoPage,
        canMatch: [canMatchDemo],
      },
      {
        path: 'demo/match',
        component: MatchFallbackPage,
      },
      { path: '**', redirectTo: 'books' },
    ],
  },
];
