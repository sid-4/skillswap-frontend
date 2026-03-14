import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ProposalService } from '../../../core/services/proposal';
import { Proposal } from '../../../core/models/proposal.model';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bids.html',
  styleUrl: './my-bids.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyBidsComponent implements OnInit, OnDestroy {
  proposals: Proposal[] = [];
  errorMessage = '';
  successMessage = '';
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private proposalService: ProposalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyBids();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMyBids(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.proposalService.getMyBids()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.proposals = res;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.error || 'Unable to load your bids';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  deleteProposal(proposalId: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.proposalService.deleteProposal(proposalId).subscribe({
      next: () => {
        this.successMessage = 'Proposal deleted successfully.';
        this.loadMyBids();
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.error || 'Unable to delete proposal';
      }
    });
  }
}