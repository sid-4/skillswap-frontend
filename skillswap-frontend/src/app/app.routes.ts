import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

import { JobListComponent } from './features/jobs/job-list/job-list';
import { CreateJobComponent } from './features/jobs/create-job/create-job';
import { MyPostingsComponent } from './features/jobs/my-postings/my-postings';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

import { MyBidsComponent } from './features/proposals/my-bids/my-bids';

import { ProfileComponent } from './features/users/profile/profile';

import { StatsComponent } from './features/platform/stats/stats';
import { JobDetailComponent } from './features/jobs/job-detail/job-detail';
import { ProposalListComponent } from './features/proposals/proposal-list/proposal-list';
import { LeaveReviewComponent } from './features/reviews/leave-review/leave-review';
import { PublicProfileComponent } from './features/users/public-profile/public-profile';
export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },

  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/create', component: CreateJobComponent, canActivate: [authGuard] },
  { path: 'jobs/:id/proposals', component: ProposalListComponent, canActivate: [authGuard] },
  { path: 'jobs/:id/review', component: LeaveReviewComponent, canActivate: [authGuard] },
  { path: 'jobs/:id', component: JobDetailComponent, canActivate: [authGuard] },

  { path: 'my-postings', component: MyPostingsComponent, canActivate: [authGuard] },
  { path: 'my-bids', component: MyBidsComponent, canActivate: [authGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'stats', component: StatsComponent },

  { path: 'users/:username', component: PublicProfileComponent },
  { path: '**', redirectTo: 'jobs' }
];
