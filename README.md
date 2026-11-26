<div align="center">

# Angular Atlas

Guía interactiva en español para aprender Angular moderno con explicaciones, ejemplos de código y laboratorios que puedes probar en el navegador.

**[Abrir Angular Atlas en Vercel](https://angular-atlas-five.vercel.app/)**

![Angular 22](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript 6](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)

</div>

## Guía interactiva en ChatGPT

Usa el **Prompt maestro** para recorrer Angular Atlas con un mentor en español. ChatGPT adapta las explicaciones a tu experiencia y a la versión de Angular que tengas instalada, propone laboratorios prácticos y evalúa lo aprendido con preguntas en el chat.

1. Abre la [guía de la carpeta `chat`](chat/CHAT.md) y copia todo el contenido del bloque **Prompt maestro**.
2. Pégalo y envíalo en una conversación nueva de [ChatGPT](https://chatgpt.com/). Puedes indicar tu nivel y si ya clonaste Angular Atlas o vas a crear un proyecto desde cero.
3. Sigue una fase a la vez. Cuando quieras avanzar, escribe **«Continuemos a la siguiente fase»**.

Para implementar los laboratorios puedes usar los prompts para GitHub Copilot Agent o pedir los pasos manuales en el chat.

## Temáticas

Angular Atlas reúne 11 temáticas. Puedes empezar por Fundamentos o ir directamente al tema que quieras practicar.

| Tema | Qué encontrarás |
| --- | --- |
| **Fundamentos de Angular** | Binding, control de flujo, directivas, pipes y plantillas con laboratorios interactivos. |
| **Componentes y ciclo de vida** | Hooks, consultas de vista y contenido, proyección con `ng-content` y un laboratorio para observar el ciclo de vida. |
| **Signals** | Estado reactivo con `signal()`, `computed()`, `linkedSignal()` y `effect()`. Comunicación entre componentes con `input()`, `output()` y `model()`. |
| **Routing y Lazy Loading** | Rutas anidadas, parámetros, guards, resolvers, precarga y eventos de navegación. |
| **Inyección de dependencias** | Alcance de servicios por aplicación, ruta y componente, configuración con `InjectionToken` y carga bajo demanda con `injectAsync()`. |
| **RxJS** | Observables fríos y calientes, Subjects, operadores y su integración con Angular. |
| **HTTP y recursos reactivos** | Peticiones con `HttpClient`, interceptores funcionales y laboratorios con `httpResource()`, `resource()` y `rxResource()`. |
| **Formularios y Signal Forms** | Laboratorio de registro de libros, ejemplos de Reactive Forms y Signal Forms, validación asíncrona y campos dinámicos. |
| **Testing con Vitest** | Pruebas de componentes, Signals, servicios, HTTP, rutas y formularios, con ejemplos de mocks, asincronía y cobertura. |
| **Rendimiento y optimización** | Detección de cambios, seguimiento de elementos con `@for`, carga diferida con `@defer` y análisis de rendimiento. |
| **Novedades de Angular** | Explorador de versiones, novedades en plantillas, Angular Aria, actualizaciones y APIs experimentales. |

## Desarrollo local

Usa la versión de Node.js indicada en `.nvmrc` (24.20.0). El proyecto declara npm 12.0.2 en `package.json`.

```bash
git clone https://github.com/DanielMedinaO/Angular-Atlas.git
cd Angular-Atlas
npm ci
npm start
```

El servidor de desarrollo recarga la aplicación al guardar cambios. [Abrir en localhost](http://localhost:4200/).

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila la aplicación para producción en `dist/angular-atlas/browser/`. |
| `npm test` | Ejecuta las pruebas unitarias con Vitest. |
| `npm test -- --coverage` | Ejecuta las pruebas y genera el reporte de cobertura. |

## Tecnologías y estructura

- **Angular 22 y TypeScript 6** con componentes standalone, Signals y carga diferida por ruta.
- **Angular Material 3, Angular Aria, Tailwind CSS y SCSS** para la interfaz. La aplicación sigue la preferencia del sistema para el tema claro u oscuro y guarda en el navegador la elección manual.
- **RxJS y Chart.js** en los laboratorios de reactividad y visualización.

```text
src/
├── app/
│   ├── core/        # Navegación y estructura compartida
│   └── features/    # Inicio y secciones temáticas
├── styles/          # Estilos compartidos
├── styles.scss      # Tokens y estilos globales
└── tailwind.css     # Punto de entrada de Tailwind CSS
public/
└── atlas-data/      # Datos estáticos de los laboratorios
```

La compilación de producción tiene un presupuesto inicial de 400 kB para advertencias y 450 kB para errores. Los estilos por componente tienen límites de 6 kB y 8 kB, respectivamente. Para inspeccionar los tamaños de los archivos y las importaciones dinámicas, ejecuta `npm run build -- --stats-json`.

## Contribuciones

Para proponer una mejora o reportar un problema, abre una incidencia o envía un pull request. [Incidencias de Angular Atlas](https://github.com/DanielMedinaO/Angular-Atlas/issues).
