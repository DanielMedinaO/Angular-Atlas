interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly link?: { readonly path: string; readonly label: string; readonly fragment?: string };
}

export const FUNDAMENTALS_LESSONS: readonly Lesson[] = [
  {
    id: 'what-is-angular',
    title: 'Qué es Angular y para qué sirve',
    description:
      'Angular es un framework para construir aplicaciones web. Puedes dividir una interfaz en piezas reutilizables, mantenerla sincronizada con los datos y añadir navegación o formularios con herramientas del propio framework.',
    code: `<!-- Angular monta la aplicación en este elemento de index.html. -->
<body>
  <app-root></app-root>
</body>`,
  },
  {
    id: 'architecture',
    title: 'Arquitectura de una aplicación Angular',
    description:
      'El componente raíz contiene la estructura común, como el menú. El router carga la pantalla de cada URL. Los componentes de esa pantalla presentan datos y los servicios pueden compartir lógica o acceder a datos.',
    code: `<!-- app.html: el menú permanece mientras cambia la pantalla. -->
<app-menu />
<router-outlet /> <!-- El router inserta aquí el componente de la ruta. -->`,
    link: { path: '/routing', label: 'Practicar con Routing y Lazy Loading' },
  },
  {
    id: 'bootstrap',
    title: 'Arranque, AppComponent y providers',
    description:
      'bootstrapApplication() monta el componente raíz standalone (App en Angular Atlas). Su configuración reúne providers que le indican a Angular cómo ofrecer dependencias como el router.',
    code: `// main.ts: monta App y registra las dependencias de la aplicación.
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, { providers: [provideRouter(routes)] })
  .catch(console.error);`,
    link: { path: '/dependency-injection', label: 'Explorar Dependency Injection' },
  },
  {
    id: 'standalone',
    title: 'Componentes standalone y sus imports',
    description:
      'Un componente reúne una clase y una plantilla. La propiedad imports declara los componentes, directivas y pipes que usa esa plantilla.',
    code: `import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-book-title',
  imports: [UpperCasePipe], // Disponible en esta plantilla.
  template: '<h2>{{ title | uppercase }}</h2>',
})
export class BookTitle {
  protected readonly title = 'Mi biblioteca';
}`,
    link: { path: '/components', label: 'Explorar Componentes y ciclo de vida' },
  },
  {
    id: 'interpolation',
    title: 'Templates, interpolación y expresiones',
    description:
      'Una plantilla combina HTML con expresiones de Angular. La interpolación con dobles llaves convierte el resultado en texto. Puedes leer propiedades, llamar a un signal o usar operadores como +.',
    code: `<!-- Lee title y calcula un número a partir del signal count. -->
<h2>{{ title() }}</h2>
<p>Siguiente número: {{ count() + 1 }}</p>`,
    link: { path: '/signals', label: 'Practicar con Signals y reactividad' },
  },
  {
    id: 'property-binding',
    title: 'Property binding y attribute binding',
    description:
      'Los corchetes envían un valor del componente a la vista. [disabled] escribe la propiedad booleana del botón. [attr.data-count] escribe un atributo HTML visible en el inspector. Angular elimina el atributo si el valor es null.',
    code: `<!-- El navegador desactiva el botón cuando la expresión es true. -->
<button [disabled]="!buttonsEnabled()">Incrementar</button>
<!-- El contador también se puede leer en el atributo del párrafo. -->
<p [attr.data-count]="count()">{{ count() }}</p>`,
  },
  {
    id: 'event-binding',
    title: 'Event binding y two-way binding',
    description:
      '(click) lleva la interacción de la vista al componente. [(value)] combina ambas direcciones: el editor recibe el título y devuelve sus cambios al signal del padre. Restaurar el título muestra el recorrido del padre al editor.',
    code: `<!-- Cada clic ejecuta increment() en el componente. -->
<button (click)="increment()">Incrementar</button>
<!-- El editor declara value = model.required<string>(). -->
<app-binding-title-editor [(value)]="title" />`,
  },
  {
    id: 'control-flow',
    title: 'Control de flujo con @if, @else, @for y @switch',
    description:
      '@if y @else eligen qué contenido mostrar. @for repite una vista por libro. Con track book.id, Angular puede conservar su nodo aunque cambie la lista. @switch elige un caso según el estado.',
    code: `@for (book of visibleBooks(); track book.id) {
  <!-- La identidad del libro se conserva al cambiar su estado. -->
  <strong>{{ book.title }}</strong>
  @if (showDetails()) {
    <p>{{ categories[book.category] }}</p>
  } @else {
    <p>Categoría oculta</p>
  }
  @switch (book.status) {
    @case ('pending') { Pendiente }
    @case ('reading') { En lectura }
    @case ('finished') { Terminado }
  }
} @empty {
  <p>No hay libros en esta categoría.</p>
}`,
  },
  {
    id: 'directives',
    title: 'Directivas de atributo y estructurales',
    description:
      'Una directiva de atributo añade comportamiento o presentación a un elemento existente. Una estructural crea o retira vistas, como NgTemplateOutlet al insertar un fragmento. Los bloques @if y @for son sintaxis propia de la plantilla.',
    code: `import { Directive } from '@angular/core';

@Directive({
  selector: '[appReadingHighlight]',
  host: { '[class.reading-highlight]': 'true' }, // Añade una clase al elemento.
})
export class ReadingHighlight {}

// Uso en la plantilla: <p appReadingHighlight>Selección destacada</p>`,
  },
  {
    id: 'pipes',
    title: 'Pipes incorporados y personalizados',
    description:
      'Usa un pipe para dar formato a un valor en la plantilla. Un pipe puro vuelve a ejecutarse cuando cambia un argumento primitivo o una referencia. Usa computed() para un dato derivado de signals, como la lista filtrada. Usa un método TypeScript para acciones como agregar un libro o para lógica que llamas explícitamente.',
    code: `<!-- DatePipe, CurrencyPipe y UpperCasePipe vienen de @angular/common. -->
{{ publishedOn | date: 'dd/MM/yyyy' : 'UTC' }}
{{ 18.5 | currency: 'USD' : 'code' }}
{{ 'Angular en práctica' | uppercase }}
<!-- El pipe readingTime estima minutos a dos páginas por minuto. -->
{{ pages() | readingTime }}

@Pipe({ name: 'readingTime', pure: true })
export class ReadingTime implements PipeTransform {
  transform(pages: number): string {
    return '≈ ' + Math.ceil(pages / 2) + ' min';
  }
}`,
  },
  {
    id: 'templates',
    title: 'ng-container, ng-template y referencias',
    description:
      'ng-template define un fragmento que puedes renderizar después. ng-container aloja el fragmento sin añadir una etiqueta al DOM. #greeting apunta al fragmento y #nameField al input. Con ng-content, el componente coloca contenido que su padre le entregó.',
    code: `<input #nameField id="reader-name" />
<!-- El fragmento recibe su nombre a través del contexto. -->
<ng-template #greeting let-name>
  <p>Hola, {{ name }}.</p>
</ng-template>
<ng-container *ngTemplateOutlet="greeting; context: { $implicit: nameField.value }" />`,
    link: {
      path: '/components',
      fragment: 'lifecycle-lab-title',
      label: 'Ver proyección con ng-content en el laboratorio de Componentes',
    },
  },
  {
    id: 'building-blocks',
    title: 'Componentes, directivas, pipes y servicios',
    description:
      'El componente pinta la vista, la directiva amplía un elemento o controla una vista, el pipe transforma un valor para mostrarlo y el servicio encapsula lógica o datos que otros pueden inyectar.',
    code: `@Service() // Angular puede proporcionar este servicio a los componentes.
export class CatalogService {
  readonly title = 'Angular en práctica';
}

// Dentro del componente:
protected readonly catalog = inject(CatalogService);

<!-- El componente combina el dato del servicio, la directiva y el pipe. -->
<p appReadingHighlight>{{ catalog.title | uppercase }}</p>`,
  },
];
