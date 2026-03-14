import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user';
import { ReviewService } from '../../../core/services/review';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any = null;
  reviews: any[] = [];
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.userService.getMe()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.user = res;
          this.cdr.markForCheck();
          if (this.user?.id) {
            this.loadReviews(this.user.id);
          }
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.error || 'Unable to load profile';
          this.cdr.markForCheck();
        }
      });
  }

  loadReviews(userId: number): void {
    this.reviewService.getReviewsByUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.reviews = res;
          this.cdr.markForCheck();
        },
        error: () => {
          this.reviews = [];
          this.cdr.markForCheck();
        }
      });
  }
}