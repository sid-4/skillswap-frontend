import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReviewService } from '../../../core/services/review';
import { JobService } from '../../../core/services/job';

@Component({
  selector: 'app-leave-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-review.html',
  styleUrl: './leave-review.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveReviewComponent implements OnInit, OnDestroy {
  errorMessage = '';
  successMessage = '';
  loading = false;

  jobId: string | number = '';
  targetUser: any = null;
  currentUser: any = null;
  job: any = null;

  form: any;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private jobService: JobService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      target_id: ['', [Validators.required]],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const idParam = params.get('id');
        this.jobId = Number(idParam) || (idParam as any);
        const storedUser = localStorage.getItem('user');
        this.currentUser = storedUser ? JSON.parse(storedUser) : null;

        if (this.jobId) {
          this.loadJob();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJob(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.jobService.getJobById(this.jobId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.job = res;
          this.loading = false;
          this.cdr.markForCheck();
          this.detectTargetUser();
        },
        error: (err) => {
          this.errorMessage = err?.error?.error || 'Unable to load job';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  detectTargetUser(): void {
    if (!this.job || !this.currentUser) return;

    if (this.job.owner?.id === this.currentUser.id && this.job.freelancer) {
      this.targetUser = this.job.freelancer;
    } else if (this.job.freelancer?.id === this.currentUser.id && this.job.owner) {
      this.targetUser = this.job.owner;
    }

    if (this.targetUser) {
      this.form.patchValue({
        target_id: this.targetUser.id
      });
    }
  }

  submitReview(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!confirm('Are you sure you want to submit this review? This action cannot be undone.')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.reviewService.createReview(this.jobId, this.form.value).subscribe({
      next: () => {
        this.successMessage = 'Review submitted successfully.';
        this.cdr.markForCheck();
        this.form.patchValue({
          rating: '',
          comment: ''
        });
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to submit review';
        this.cdr.markForCheck();
      }
    });
  }
}