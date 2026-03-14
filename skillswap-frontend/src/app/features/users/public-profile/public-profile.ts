import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user';
import { ReviewService } from '../../../core/services/review';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  user: any = null;
  reviews: any[] = [];
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.loadUser(username);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUser(username: string): void {
    this.userService.getPublicProfile(username)
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
          this.errorMessage = err?.error?.error || 'Unable to load public profile';
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