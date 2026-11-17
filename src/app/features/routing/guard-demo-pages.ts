import { Component } from '@angular/core';

@Component({
  selector: 'app-activate-demo-page',
  template: `
    <section class="guard-result" aria-live="polite">
      <h3>Ruta activada</h3>
      <p>CanActivate permitió activar esta ruta.</p>
    </section>
  `,
  styles: `
    .guard-result { display: grid; gap: 0.5rem; }
    .guard-result h3 { font-size: 1.05rem; }
  `,
})
export class ActivateDemoPage {}

@Component({
  selector: 'app-match-demo-page',
  template: `
    <section class="guard-result" aria-live="polite">
      <h3>Configuración seleccionada</h3>
      <p>CanMatch permitió que esta configuración participara en el matching.</p>
    </section>
  `,
  styles: `
    .guard-result { display: grid; gap: 0.5rem; }
    .guard-result h3 { font-size: 1.05rem; }
  `,
})
export class MatchDemoPage {}

@Component({
  selector: 'app-match-fallback-page',
  template: `
    <section class="guard-result" aria-live="polite">
      <h3>Ruta alternativa</h3>
      <p>CanMatch devolvió false; el router probó la siguiente configuración con la misma ruta.</p>
    </section>
  `,
  styles: `
    .guard-result { display: grid; gap: 0.5rem; }
    .guard-result h3 { font-size: 1.05rem; }
  `,
})
export class MatchFallbackPage {}
