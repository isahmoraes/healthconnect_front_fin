import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Informe e-mail e senha válidos.';
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email?.trim() ?? '';
    const password = this.loginForm.value.password ?? '';

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      }
    });
  }
}
