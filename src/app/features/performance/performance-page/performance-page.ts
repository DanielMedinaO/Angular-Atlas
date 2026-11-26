import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChangeDetectionLab } from '../change-detection-lab/change-detection-lab';
import { DeferLab } from '../defer-lab/defer-lab';
import { ListRenderingLab } from '../list-rendering-lab/list-rendering-lab';

@Component({
  selector: 'app-performance-page',
  imports: [RouterLink, ChangeDetectionLab, ListRenderingLab, DeferLab],
  templateUrl: './performance-page.html',
  styleUrl: './performance-page.scss',
})
export class PerformancePage {}
