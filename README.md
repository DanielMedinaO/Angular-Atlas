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
| **Rendimiento y optimización** | Detección de cambios, identidad en listas, carga diferida y profiling en `/performance`. |

Otros temas, como RxJS, están previstos para próximas entregas.

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

## Presupuestos de producción

La línea base de la fase 9 (`5d04e5f`) produjo 336,07 kB iniciales y 92,51 kB de
transferencia estimada por el CLI. Con `/performance`, el build produjo 345,80 kB iniciales y
94,83 kB de transferencia estimada. El total de JS y CSS pasó de 706.450 a 927.189 bytes
al sumar los archivos iniciales y lazy una sola vez. La página aporta un chunk lazy de
45.848 bytes. El gráfico con Chart.js viaja en otro chunk de 165.480 bytes.

El presupuesto `initial` de `angular.json` pasa de 500 kB / 1 MB a 400 kB de advertencia y
450 kB de error. Con el build de la fase 9, esos límites dejan aproximadamente 54,20 kB para
avisar de un crecimiento sostenido y 104,20 kB para bloquear una regresión mayor. Los límites
de CSS por componente son 6 kB y 8 kB. El build pasó sin advertencias de tamaño y el CSS de
Shell aporta cerca de 6 kB según el metarchivo, por lo que esos límites siguen siendo útiles.

Genera `dist/angular-atlas/browser-stats.json` con
`npx ng build --configuration production --stats-json` y consulta `outputs` para comprobar
los tamaños y los imports dinámicos. En el build de la fase 9, el chunk compartido principal
de Angular creció 9.251 bytes. Una compilación de control que omitió el laboratorio
`@defer` situó casi todo ese aumento en el runtime compartido que habilita el bloque diferido.

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
