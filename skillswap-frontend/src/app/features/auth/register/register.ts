import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  errorMessage = '';
  loading = false;
  suggestedUsername = '';
  form: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
   this.form = this.fb.group({
  name: ['', [Validators.required]],
  username: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  bio: ['', [Validators.required]],
  skillsInput: ['', [Validators.required]]
});
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    this.suggestedUsername = '';

    const payload = {
      name: this.form.value.name,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      bio: this.form.value.bio,
      skills: this.form.value.skillsInput
        .split(',')
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0)
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.error || 'Registration failed';

        if (err?.error?.suggested_username) {
          this.suggestedUsername = err.error.suggested_username;
        }
      }
    });
  }
}