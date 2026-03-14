import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { JobService } from '../../../core/services/job';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-my-postings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-postings.html',
  styleUrl: './my-postings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPostingsComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  errorMessage = '';
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private jobService: JobService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

loadMyJobs(): void {
  this.loading = true;
  this.errorMessage = '';

  this.jobService.getMyPostings()
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.jobs = res;
        } else if (res && Array.isArray(res.jobs)) {
          this.jobs = res.jobs;
        } else {
          this.jobs = [];
        }
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to load your jobs';
        this.cdr.markForCheck();
      }
    });
}
}