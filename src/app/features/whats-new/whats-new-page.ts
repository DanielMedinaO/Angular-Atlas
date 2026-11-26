import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AriaLab } from './aria-lab/aria-lab';
import { MaintenanceLab } from './maintenance-lab/maintenance-lab';
import { ReleaseRadar } from './release-radar/release-radar';
import { TemplateLab } from './template-lab/template-lab';

@Component({
  selector: 'app-whats-new-page',
  imports: [RouterLink, ReleaseRadar, TemplateLab, AriaLab, MaintenanceLab],
  templateUrl: './whats-new-page.html',
  styleUrl: './whats-new-page.scss',
})
export class WhatsNewPage {}
