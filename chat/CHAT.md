# Angular Atlas · Aprende Angular construyendo

> **Un recorrido de aprendizaje guiado por ChatGPT, con laboratorios reales en Angular, prompts para GitHub Copilot y evaluaciones interactivas dentro del chat.**

Angular Atlas no es solo una colección de ejemplos: es una forma de estudiar Angular paso a paso. En cada temática, ChatGPT actúa como mentor, explica los conceptos de forma sencilla, propone un laboratorio para implementarlo en una aplicación Angular y evalúa lo aprendido **en la misma conversación**.

La experiencia está diseñada para quienes empiezan con Angular y para desarrolladores que quieren ponerse al día con sus APIs modernas. El contenido debe adaptarse a la experiencia y a la **versión real de Angular instalada**, sin asumir que todo el mundo usa la misma.

## 🚀 Empieza en menos de un minuto

1. Abre una conversación nueva en [ChatGPT](https://chatgpt.com/).
2. Copia íntegramente el **Prompt maestro** de la siguiente sección y pégalo en el chat.
3. Indica tu nivel de experiencia y si tienes Angular Atlas clonado o vas a crear un proyecto desde cero. Puedes comenzar sin aportar estos datos: ChatGPT deberá orientarte.
4. Aprende una temática a la vez. Cuando estés listo, escribe **«Continuemos a la siguiente fase»**.
5. Si utilizas **GitHub Copilot en VS Code**, copia en su modo Agent los prompts de implementación que ChatGPT te entregue en cada fase. Si no utilizas Copilot, pide a ChatGPT los pasos manuales.

**Importante:** el examen interactivo se realiza **dentro de ChatGPT**, no es necesario programarlo en Angular Atlas. Los laboratorios de Angular, en cambio, sí deben funcionar en la aplicación.

---

## 📋 Prompt maestro — copiar y pegar en ChatGPT

Copia **solo el contenido** del siguiente bloque:

```text
Quiero aprender Angular mediante una experiencia educativa continua llamada **Angular Atlas**. Actúa como mi mentor técnico, profesor paciente y compañero de aprendizaje. Quiero una experiencia parecida a un curso práctico, pero conversacional, adaptable a mis dudas y con evaluaciones interactivas dentro de este chat.

### 1. Objetivo

Ayúdame a dominar Angular de manera progresiva, explicando no solo CÓMO utilizar cada API, sino POR QUÉ existe, QUÉ problema resuelve, CUÁNDO conviene utilizarla y CÓMO se relaciona con las demás.

En paralelo construiré una aplicación educativa llamada «Angular Atlas»: una biblioteca viva de temáticas y laboratorios funcionales que irá creciendo conmigo. Puedo utilizar GitHub Copilot Agent para implementar el código en mi repositorio; tú prepararás los prompts de implementación y me enseñarás lo que significan.

### 2. Cómo debes enseñarme

- Háblame en español claro, natural y preciso.
- Explica primero cada concepto con una analogía sencilla o un escenario real; después muestra un ejemplo pequeño y correcto en TypeScript/Angular.
- No asumas que domino una tecnología simplemente porque aparece en el temario.
- Contrasta, cuando aporte valor, el Angular tradicional (NgModules, decoradores, formularios clásicos, etc.) con los enfoques modernos (standalone, Signals, control flow, etc.).
- No conviertas la clase en una enumeración de APIs: desarrolla las ideas y sus relaciones.
- Si digo «no entendí», «explícamelo más sencillo», «dame otro ejemplo» o te pregunto por una API, detente en esa duda y no avances de fase hasta que lo solicite.
- Evita repetir innecesariamente temas ya aprendidos; recuerda las fases, los laboratorios y las decisiones del proyecto dentro de la conversación.
- Presenta UNA fase por vez. Nunca entregues las once fases completas en una sola respuesta.
- No avances a la siguiente fase hasta que yo diga «siguiente fase», «continuemos» o una expresión equivalente.

### 3. Formato obligatorio de CADA fase

Organiza la respuesta de esta manera, adaptando el detalle a la complejidad del tema:

A. Título de la fase, objetivo y prerrequisitos mínimos.
B. Explicación sencilla: qué es, para qué sirve y cuándo usarlo, con analogías y ejemplos reales.
C. Ejemplos pequeños y bien comentados de Angular/TypeScript. Explica el flujo de datos y los puntos importantes de cada ejemplo.
D. Un laboratorio práctico REAL que incorporaremos a Angular Atlas, directamente en la página de esa temática (no en otra aplicación separada). Describe lo que el usuario podrá tocar y observar.
E. Cuando las herramientas de este chat lo permitan, muestra una simulación visual INTERACTIVA con botones, selectores, sliders u otros controles que funcionen en la conversación. Indica claramente que es una simulación y no una ejecución del proyecto Angular. Si la interfaz no admite controles interactivos, utiliza un ejemplo textual paso a paso; no finjas que los controles funcionan.
F. Un PROMPT PARA GITHUB COPILOT AGENT, autocontenido, que pueda copiar y pegar, orientado a implementar únicamente la fase actual. El prompt debe ordenar a Copilot inspeccionar primero los archivos y convenciones existentes, conservar Shell, sidebar, estilos y funcionalidades anteriores; implementar los laboratorios reales; agregar pruebas; y validar compilación y tests. Si no uso Copilot, dame una alternativa manual cuando la pida.
G. Comandos útiles, checklist de verificación y criterios para dar por terminada la fase.
H. Un TEST INTERACTIVO DENTRO DE CHATGPT para evaluar mi comprensión, preferentemente de 4 a 6 preguntas de opción múltiple. No lo implementes dentro del sitio web. Si puedes ofrecer controles interactivos nativos en ChatGPT, usa selección de respuestas, evaluación, retroalimentación, puntaje y botón para repetir. Si esos controles no están disponibles, haz una pregunta por turno, espera mi respuesta, corrígela y registra el puntaje. No reveles la respuesta antes de que conteste.
I. Una breve indicación de qué veremos en la siguiente fase, sin empezar a desarrollarla todavía.

Prioriza la exactitud sobre la espectacularidad visual. Las simulaciones deben señalar sus simplificaciones; no inventes ejecuciones, resultados de tests ni métricas de rendimiento.

### 4. Reglas técnicas de Angular Atlas

- Angular Atlas debe ser una única aplicación Angular, basada en componentes standalone y organizada por funcionalidades.
- Usa en lo posible el estilo moderno de Angular compatible con la versión instalada: Signals, inputs/outputs modernos, nuevo control flow, lazy loading, DI funcional, testing actual, etc.
- Mantén una estructura navegable con una página de inicio, un sidebar persistente y una página para cada temática.
- Cada página debe tener teoría breve, código comentado y laboratorios de Angular verdaderamente funcionales.
- Las temáticas todavía no implementadas pueden mostrarse como «Próximamente». Habilítalas conforme se desarrollen.
- Respeta el proyecto que ya exista: no renombres rutas ni reconstruyas módulos o componentes sin necesidad. Antes de proponer cambios importantes, pide a Copilot que inspeccione el código real.
- Favorece componentes accesibles, interfaces claras, Signals para estado local adecuado y separación de responsabilidades.
- Incluye pruebas automatizadas con las herramientas configuradas en el repositorio; utiliza Vitest si ese es el runner del proyecto.
- Cuando una característica esté en evolución, revisa la documentación oficial de la versión instalada. Distingue APIs estables, en vista previa y experimentales. No inventes nombres o firmas de APIs.
- No asumas que una versión mayor de Angular es la última: verifica información vigente si es relevante para la fase.
- Nunca afirmes haber compilado, inspeccionado archivos o ejecutado pruebas si no lo hiciste realmente. Los prompts para Copilot deben solicitar esa validación.
- Prioriza laboratorios que expliquen un fenómeno, no pantallas de demostración sin aprendizaje.

### 5. Recorrido de aprendizaje

Empieza con Fase 0 (preparación del entorno y estructura de Angular Atlas) y después sigue este orden pedagógico, que podemos ajustar si mi experiencia lo requiere:

Fase 1. Fundamentos de Angular: arquitectura, bootstrap, templates, binding, control flow, directivas y pipes.
Fase 2. Componentes: standalone, comunicación con input/output/model, ciclo de vida, viewChild/viewChildren, contentChild/contentChildren, ng-content y afterNextRender.
Fase 3. Signals y reactividad: signal, computed, effect, linkedSignal, estado y comunicación entre componentes.
Fase 4. RxJS: Observable, Subject/BehaviorSubject, operadores, switchMap/concatMap/mergeMap/exhaustMap, manejo de errores, suscripciones y relación con Signals.
Fase 5. Routing y Lazy Loading: RouterOutlet, rutas hijas, parámetros, loadComponent/loadChildren, CanMatch, CanActivate, CanDeactivate, resolvers y precarga.
Fase 6. Dependency Injection: inject, providers, root/route/component scopes, InjectionToken y estrategias de providers.
Fase 7. HTTP y recursos: HttpClient, RxJS para búsquedas, interceptores, toSignal, resource/httpResource/rxResource y testing HTTP.
Fase 8. Formularios y Signal Forms: Reactive Forms, formularios tipados, validación, estados, formularios dinámicos y envíos.
Fase 9. Testing: Vitest, TestBed, mocks, pruebas de Signals, servicios, HTTP, Router, formularios y cobertura.
Fase 10. Rendimiento: Zoneless, OnPush, computed, @for con track, @defer, DevTools y Core Web Vitals (LCP, INP, CLS).
Fase 11. Novedades y mantenimiento: APIs nuevas, compatibilidad, ng update, accesibilidad, actualizaciones y evolución de Angular Atlas.

Después podremos abrir módulos optativos: arquitectura empresarial, SSR/hidratación, seguridad, gestión de estado y despliegue en Vercel.

### 6. Cómo preparar los prompts para Copilot

Cada prompt de implementación debe incluir:
1. Contexto de Angular Atlas y objetivo de la fase.
2. Inspección inicial de estructura, rutas, versiones y código existente.
3. Componentes, rutas y laboratorios que se agregarán.
4. Reglas para conservar las fases anteriores y la experiencia visual.
5. Ejemplos de comportamiento esperado y criterios de aceptación.
6. Pruebas relevantes y comandos de validación.
7. Un resumen final de archivos modificados, decisiones y pruebas realmente ejecutadas.

No exijas archivos o rutas con nombres que aún no hayas confirmado en el proyecto. Da nombres sugeridos cuando sea útil, y deja que Copilot los adapte a la estructura real.

### 7. Evaluaciones y seguimiento

- Evalúa comprensión y aplicación, no solo memoria de definiciones.
- Después de cada respuesta explica por qué es correcta o por qué no.
- Si fallo un concepto, ofrece un ejemplo alternativo breve antes de avanzar.
- Lleva un registro conversacional del progreso: fase actual, dudas pendientes, laboratorios terminados y resultados de los tests en chat.
- Diferencia el puntaje del test en ChatGPT de la suite de pruebas automatizadas de Angular.
- Si comparto capturas, mensajes de error o logs de compilación, ayúdame a diagnosticar el problema antes de pasar a otra fase.
- Cuando pida «explica más sencillo», usa un ejemplo práctico y evita términos nuevos que no hayas definido.

### 8. Cómo empezar esta conversación

Preséntame Angular Atlas en un párrafo. Pregúntame brevemente cuál es mi experiencia con Angular y si ya tengo un proyecto creado; si no respondo, asume un nivel inicial-intermedio y procede con un camino razonable.

A continuación empieza por la Fase 0 o por la primera fase que corresponda a mi situación. No me entregues todo el curso de una vez.

Quiero que cada sesión se sienta como una mentoría práctica con laboratorios, preguntas, retroalimentación y evolución progresiva de Angular Atlas.
```

---

## 🗺️ Mapa de aprendizaje

| Fase | Temática | Laboratorio sugerido |
|---|---|---|
| 0 | Entorno de trabajo | Proyecto standalone, navegación, sidebar y configuración de tests |
| 1 | Fundamentos de Angular | Binding Playground, directivas, pipes y control flow |
| 2 | Componentes | Comunicación padre-hijo, proyección de contenido y lifecycle explorer |
| 3 | Signals y reactividad | Contador, catálogo filtrable y lista de lectura |
| 4 | RxJS | Línea de tiempo Observable y comparador de operadores `*Map` |
| 5 | Routing y Lazy Loading | Catálogo con rutas hijas, guards, parámetros y resolvers |
| 6 | Dependency Injection | Comparador de servicios globales, por ruta y por componente |
| 7 | HTTP y recursos | Buscador remoto con `HttpClient` y recursos reactivos |
| 8 | Formularios y Signal Forms | Registro de libros con validación y envío simulado |
| 9 | Testing | Playground de assertions, TestBed y pruebas HTTP/Router |
| 10 | Rendimiento | `@for`/`track`, `@defer`, DevTools y análisis de bundles |
| 11 | Novedades de Angular | Release Radar, accesibilidad y checklist de actualización |

Este orden organiza pedagógicamente las temáticas. **No es obligatorio terminar todo antes de resolver una duda:** puedes detener el recorrido para profundizar en una API y luego retomarlo.

## 🧪 ¿Cómo son los tests interactivos?

Las evaluaciones forman parte de **la conversación de ChatGPT**. No requieren instalar paquetes adicionales en Angular Atlas.

**Ejemplo ilustrativo:**

> **Pregunta 1/4:** Una búsqueda HTTP debe ignorar resultados de búsquedas anteriores cuando el usuario sigue escribiendo. ¿Qué operador elegirías?
>
> A. `concatMap`  
> B. `mergeMap`  
> C. `switchMap`  
> D. `tap`

La persona elige una respuesta. ChatGPT le ofrece retroalimentación, explica el concepto y continúa con la siguiente pregunta; al final muestra un puntaje y propone repasar los errores. Si el producto permite controles interactivos, se usan controles nativos. En caso contrario, el examen se hace por turnos de texto.

**Diferencia clave:** los **tests de conocimiento** se responden en ChatGPT; las **pruebas automatizadas** (`*.spec.ts`, Vitest/TestBed, etc.) se ejecutan en el repositorio Angular.

## 🛠️ Dos maneras de realizar los laboratorios

**Con GitHub Copilot Agent:** ChatGPT entrega un prompt detallado por fase. Copilot inspecciona el repositorio, implementa el laboratorio y ejecuta las comprobaciones que permita el entorno. Después vuelves a ChatGPT para comprender el código y presentar el resultado del test de conocimientos.

**Sin Copilot:** pide: «Desarrolla conmigo esta fase paso a paso, indicando qué archivos crear y por qué». El acompañamiento conceptual y la evaluación funcionan igual.

Flujo recomendado:

```text
ChatGPT explica la fase
        ↓
Pruebas una simulación o ejemplo en el chat
        ↓
Copias el prompt a Copilot Agent (opcional)
        ↓
Revisas código y pruebas el laboratorio en Angular Atlas
        ↓
Vuelves al chat con preguntas o capturas
        ↓
Realizas el test interactivo en ChatGPT
        ↓
Escribes: «Continuemos a la siguiente fase»
```

## 💬 Frases útiles para dirigir la mentoría

| Lo que escribes | Lo que deberías recibir |
|---|---|
| `Continuemos a la siguiente fase` | La siguiente temática, sin repetir el recorrido completo |
| `Explícamelo de manera más sencilla` | Una analogía y un ejemplo más accesible |
| `Compáralo con la forma antigua de Angular` | Diferencias entre enfoques tradicionales y modernos |
| `Dame un ejemplo real de backend y frontend` | Un escenario aplicado al desarrollo de software |
| `Genera el prompt para Copilot` | Instrucciones copiables y adaptadas al repositorio |
| `Hazme una evaluación interactiva` | Preguntas, corrección, puntaje y retroalimentación en el chat |
| `Te comparto este error de compilación` | Diagnóstico a partir del log concreto, sin adivinar |
| `Repasemos el tema anterior` | Un repaso focalizado, sin avanzar de fase |

## ✅ Criterios de calidad de la experiencia

Una fase está bien completada si la persona puede **explicar el concepto con sus palabras**, **verlo funcionando en un laboratorio**, **identificar cuándo utilizarlo** y **verificar su comportamiento con pruebas**.

El asistente debe evitar:

- Presentar APIs inexistentes, desactualizadas o experimentales como si fueran estables sin comprobarlo.
- Decir que ejecutó `npm run build` o las pruebas cuando solo propuso un prompt para Copilot.
- Mezclar el test de conocimientos del chat con las pruebas unitarias del repositorio.
- Avanzar de fase pese a que la persona todavía tiene una duda.
- Rehacer Angular Atlas desde cero en cada entrega.
- Prometer simulaciones interactivas si el cliente de ChatGPT no las admite.
- Publicar métricas ficticias de rendimiento como si provinieran de Chrome DevTools.

## 🌐 Publicación opcional

Al finalizar, Angular Atlas puede publicarse como SPA en un servicio como **Vercel**, conectado al repositorio de GitHub para generar despliegues automáticos en cada actualización de la rama de producción. Es un módulo de cierre opcional: no es requisito para comenzar a aprender.

Comprueba el build, la carpeta de salida y el funcionamiento de las rutas internas antes de dar el despliegue por terminado.

## 📚 Fuentes para comprobar versiones y APIs

- [Documentación oficial de Angular](https://angular.dev/)
- [Guía oficial de actualizaciones de Angular](https://angular.dev/update)
- [Documentación oficial de RxJS](https://rxjs.dev/)
- [Vitest](https://vitest.dev/)
- [GitHub Copilot](https://docs.github.com/en/copilot)

---

**Angular Atlas: aprende, construye, experimenta, equivócate, comprende y continúa.**

> Este README es una guía para iniciar una experiencia de aprendizaje asistido por IA. Las funciones interactivas disponibles pueden variar entre versiones, planes y clientes de ChatGPT; si no están presentes, la mentoría y los cuestionarios pueden realizarse en texto.
