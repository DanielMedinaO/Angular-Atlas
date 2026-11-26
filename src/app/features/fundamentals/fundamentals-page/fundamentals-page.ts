import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BindingPlayground } from '../binding-playground/binding-playground';
import { ControlFlowLab } from '../control-flow-lab/control-flow-lab';
import { DirectivesPipesLab } from '../directives-pipes-lab/directives-pipes-lab';
import { FUNDAMENTALS_LESSONS } from './fundamentals-lessons';
import { TemplatesLab } from '../templates-lab/templates-lab';

@Component({
  selector: 'app-fundamentals-page',
  imports: [RouterLink, BindingPlayground, ControlFlowLab, DirectivesPipesLab, TemplatesLab],
  templateUrl: './fundamentals-page.html',
  styleUrl: './fundamentals-page.scss',
})
export class FundamentalsPage {
  protected readonly lessons = FUNDAMENTALS_LESSONS;
}
