import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { releaseCatalog, releaseStatuses, verifiedAt } from './release-catalog';

@Component({
  selector: 'app-release-radar',
  imports: [RouterLink],
  templateUrl: './release-radar.html',
  styleUrls: ['../lab.scss', './release-radar.scss'],
})
export class ReleaseRadar {
  protected readonly query = signal('');
  protected readonly status = signal('');
  protected readonly version = signal('');
  protected readonly verifiedAt = verifiedAt;
  protected readonly statuses = releaseStatuses;
  protected readonly statusOptions = Object.entries(releaseStatuses);
  protected readonly versions = [
    ...new Set(releaseCatalog.map((feature) => feature.introducedIn)),
  ].sort((left, right) => right.localeCompare(left, 'es', { numeric: true }));

  protected readonly results = computed(() => {
    const query = this.normalize(this.query().trim());
    const status = this.status();
    const version = this.version();

    return releaseCatalog.filter((feature) => {
      const searchable = this.normalize(
        [feature.name, feature.category, feature.description].join(' '),
      );
      return (
        searchable.includes(query) &&
        (!status || feature.status === status) &&
        (!version || feature.introducedIn === version)
      );
    });
  });

  private normalize(text: string): string {
    return text
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }
}
