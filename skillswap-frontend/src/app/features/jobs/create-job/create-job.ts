import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../core/services/job';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.css'
})
export class CreateJobComponent {
  errorMessage = '';
  loading = false;
  form: any;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router
  ) {
   this.form = this.fb.group({
  title: ['', [Validators.required]],
  description: ['', [Validators.required]],
  budget: ['', [Validators.required, Validators.min(1)]],
  category: ['', [Validators.required]]
});
  }

  createJob(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.jobService.createJob(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/my-postings']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.error || 'Unable to create job';
      }
    });
  }
}