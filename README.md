<div align="center">

# Angular Atlas

### Aprende Angular construyendo, explorando y experimentando.

Una guía interactiva y en evolución para entender Angular moderno: conceptos claros, ejemplos ejecutables y espacio para practicar.

[Explorar el proyecto](https://github.com/DanielMedinaO/Angular-Atlas) · [Reportar un problema](https://github.com/DanielMedinaO/Angular-Atlas/issues)

![Angular 22](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)

</div>

---

## ¿Qué es Angular Atlas?

Angular Atlas es una biblioteca de aprendizaje para desarrolladores que quieren comprender Angular con ejemplos, no solo leer sobre él. Cada tema busca combinar explicación, demostraciones que puedes probar y ejercicios prácticos.

El proyecto está en desarrollo: puedes explorar los temas disponibles y seguir su evolución desde este repositorio.

## Contenido disponible

| Tema | Qué encontrarás |
| --- | --- |
| **Componentes y ciclo de vida** | Composición de componentes, comunicación y un laboratorio para explorar su ciclo de vida. |
| **Signals y reactividad** | Estado reactivo, un contador interactivo, un explorador de libros y comunicación entre componentes. |
| **Routing y Lazy Loading** | Rutas anidadas, parámetros, guards, resolvers, eventos y estrategias de carga. |

Otros temas, como RxJS, formularios y testing, están previstos para próximas entregas.

## Empieza en local

Necesitas [Node.js](https://nodejs.org/) y npm instalados.

```bash
# Clona el repositorio
git clone https://github.com/DanielMedinaO/Angular-Atlas.git
cd Angular-Atlas

# Instala las dependencias
npm install

# Inicia la aplicación
npm start
```

Abre [http://localhost:4200](http://localhost:4200) para recorrer Angular Atlas. El servidor de desarrollo recarga la aplicación cuando guardas cambios.

## Comandos útiles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm test` | Ejecuta las pruebas unitarias con Vitest. |

## Tecnologías y enfoque

- **Angular 22** y **TypeScript**.
- Componentes standalone y rutas con carga diferida.
- Signals para el estado reactivo local.
- **Vitest** para las pruebas unitarias.
- Diseño por funcionalidades, con demostraciones pequeñas e interactivas.

La paleta de Angular Atlas se inspira en [angular.dev](https://angular.dev/): superficies neutras,
acentos violeta y rosa, y tarjetas con bordes sutiles. Los tokens compartidos están en
`src/styles.scss` y el tratamiento común de tarjetas en `src/styles/_card.scss`, junto con el tema
Material 3 y las utilidades Tailwind ya instaladas. Los temas claro y oscuro se aplican al sitio.
El botón de la barra superior
guarda la elección en el navegador; si no existe una elección, se usa la preferencia del sistema.
Inter y JetBrains Mono tienen fuentes de respaldo locales.

## Estructura del proyecto

```text
src/app/
├── core/       # Navegación y estructura compartida
└── features/   # Inicio, componentes, Signals y Routing
```

## Contribuye

¿Tienes una idea para un tema, una mejora o encontraste un problema? [Abre una incidencia](https://github.com/DanielMedinaO/Angular-Atlas/issues) o envía un pull request. Las contribuciones que mejoran la claridad, los ejemplos y la accesibilidad son especialmente bienvenidas.

---

<div align="center">
  Hecho para aprender Angular, una idea a la vez.
</div>
