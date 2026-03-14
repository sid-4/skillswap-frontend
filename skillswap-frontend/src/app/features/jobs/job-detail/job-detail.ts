import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { JobService } from '../../../core/services/job';
import { ProposalService } from '../../../core/services/proposal';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobDetailComponent implements OnInit, OnDestroy {
  job: Job | null = null;
  currentUser: any = null;

  errorMessage = '';
  successMessage = '';
  loading = false;

  proposalForm: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private proposalService: ProposalService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    const storedUser = localStorage.getItem('user');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;

    this.proposalForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(1)]],
      cover_letter: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.loadJob(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJob(id: string | number): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.jobService.getJobById(id as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.job = res;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err?.error?.error || 'Unable to load job details';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  isOwner(): boolean {
    return !!this.job && !!this.currentUser && this.job.owner?.id === this.currentUser.id;
  }

  isAssignedFreelancer(): boolean {
    return !!this.job && !!this.currentUser && this.job.freelancer?.id === this.currentUser.id;
  }

  canSubmitProposal(): boolean {
    return !!this.job && this.job.status === 'open' && !this.isOwner();
  }

  canViewProposals(): boolean {
    return this.isOwner();
  }

  canCompleteJob(): boolean {
    return !!this.job &&
      this.job.status === 'in_progress' &&
      (this.isOwner() || this.isAssignedFreelancer());
  }

  canLeaveReview(): boolean {
    return !!this.job &&
      this.job.status === 'completed' &&
      (this.isOwner() || this.isAssignedFreelancer());
  }

  submitProposal(): void {
    if (!this.job) return;

    if (this.proposalForm.invalid) {
      this.proposalForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.proposalService.submitProposal(this.job.id, this.proposalForm.value).subscribe({
      next: () => {
        this.successMessage = 'Proposal submitted successfully.';
        this.proposalForm.reset();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Unable to submit proposal';
      }
    });
  }

  completeJob(): void {
    if (!this.job) return;

    if (!confirm('Are you sure you want to mark this job as completed? This action cannot be undone.')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.jobService.completeJob(this.job.id).subscribe({
      next: () => {
        this.successMessage = 'Job marked as completed.';
        this.cdr.markForCheck();
        this.loadJob(this.job!.id);
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to complete job';
        this.cdr.markForCheck();
      }
    });
  }
}