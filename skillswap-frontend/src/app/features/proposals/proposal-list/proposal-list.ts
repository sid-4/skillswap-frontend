import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProposalService } from '../../../core/services/proposal';
import { Proposal } from '../../../core/models/proposal.model';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proposal-list.html',
  styleUrl: './proposal-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalListComponent implements OnInit, OnDestroy {
  proposals: Proposal[] = [];
  errorMessage = '';
  successMessage = '';
  loading = false;
  jobId: string | number = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.jobId = params.get('id') as any;
        if (this.jobId) {
          this.loadProposals();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProposals(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.proposalService.getJobProposals(this.jobId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.proposals = res;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err?.error?.error || 'Unable to load proposals';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  acceptProposal(proposalId: number): void {
    if (!confirm('Are you sure you want to accept this proposal? This will reject all other proposals.')) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.proposalService.acceptProposal(proposalId).subscribe({
      next: () => {
        this.successMessage = 'Proposal accepted successfully.';
        this.cdr.markForCheck();
        this.loadProposals();
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to accept proposal';
        this.cdr.markForCheck();
      }
    });
  }
}