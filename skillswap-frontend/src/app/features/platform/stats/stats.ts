import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService } from '../../../core/services/platform';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent implements OnInit {
  stats: any = null;
  errorMessage = '';

  constructor(
    private platformService: PlatformService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.platformService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to load platform stats';
        this.cdr.markForCheck();
      }
    });
  }
}