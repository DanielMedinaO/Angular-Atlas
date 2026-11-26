import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aria-lab',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: `
    <p>
      Angular Aria proporciona comportamiento, teclado y atributos accesibles mediante directivas.
      Angular Material ofrece componentes con estilos y temas de Material Design. Aquí las
      directivas de Aria conservan los estilos de Angular Atlas.
    </p>
    <p>
      Entra con Tab y usa las flechas izquierda y derecha para mover el foco y seleccionar. La
      pestaña «Próximamente» se omite al navegar y no se activa con el puntero.
    </p>
    <div ngTabs>
      <div
        ngTabList
        aria-label="Recursos de estudio"
        selectionMode="follow"
        selectedTab="overview"
        [softDisabled]="false"
      >
        <button type="button" ngTab value="overview">Resumen</button>
        <button type="button" ngTab value="future" [disabled]="true">Próximamente</button>
        <button type="button" ngTab value="practice">Práctica</button>
      </div>
      <div ngTabPanel value="overview" [hidden]="!overview.visible()" #overview="ngTabPanel">
        <ng-template ngTabContent>Las pestañas agrupan contenidos relacionados.</ng-template>
      </div>
      <div ngTabPanel value="future" [hidden]="!future.visible()" #future="ngTabPanel">
        <ng-template ngTabContent>Este panel está reservado para una futura actividad.</ng-template>
      </div>
      <div ngTabPanel value="practice" [hidden]="!practice.visible()" #practice="ngTabPanel">
        <ng-template ngTabContent>Pulsa Tab para ir al panel de la pestaña activa.</ng-template>
      </div>
    </div>
    <pre
      tabindex="0"
      role="region"
      aria-label="Código de pestañas de Angular Aria"
    ><code>{{ snippet }}</code></pre>
    <p><a href="https://angular.dev/guide/aria/tabs">Guía oficial de Tabs</a></p>
  `,
  styleUrls: ['../lab.scss', './aria-lab.scss'],
})
export class AriaLab {
  protected readonly snippet = `<div ngTabs>
  <div ngTabList aria-label="Recursos de estudio"
    selectionMode="follow" selectedTab="overview" [softDisabled]="false">
    <button type="button" ngTab value="overview">Resumen</button>
    <button type="button" ngTab value="future" [disabled]="true">Próximamente</button>
    <button type="button" ngTab value="practice">Práctica</button>
  </div>
  <!-- Cada panel comparte el value de su pestaña. -->
  <div ngTabPanel value="overview" [hidden]="!overview.visible()" #overview="ngTabPanel">
    <ng-template ngTabContent>Las pestañas agrupan contenidos relacionados.</ng-template>
  </div>
  <!-- Los paneles future y practice siguen el mismo patrón. -->
</div>`;
}
