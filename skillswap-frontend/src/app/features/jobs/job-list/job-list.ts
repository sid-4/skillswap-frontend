import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { JobService } from '../../../core/services/job';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  errorMessage = '';
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

loadJobs(): void {
  this.loading = true;
  this.errorMessage = '';

  this.jobService.searchJobs({})
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res: Job[]) => {
        this.jobs = Array.isArray(res) ? res : [];
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to load jobs';
        this.cdr.markForCheck();
      }
    });
}
}