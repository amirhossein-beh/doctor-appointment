import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="container">
        <div class="login-card" @slideIn>
          <div class="card-header">
            <div class="logo">🏥</div>
            <h1>ورود به حساب کاربری</h1>
            <p>برای رزرو نوبت وارد حساب خود شوید</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>ایمیل</label>
              <input
                type="email"
                formControlName="email"
                placeholder="example@email.com"
                [class.error-input]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <span class="error">ایمیل معتبر وارد کنید</span>
              }
            </div>

            <div class="form-group">
              <label>رمز عبور</label>
              <input
                type="password"
                formControlName="password"
                placeholder="رمز عبور خود را وارد کنید"
                [class.error-input]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <span class="error">رمز عبور الزامی است</span>
              }
            </div>

            @if (errorMessage) {
              <div class="error-message" @fadeIn>
                {{ errorMessage }}
              </div>
            }

            <button
              type="submit"
              class="submit-btn"
              [disabled]="loginForm.invalid || isLoading"
            >
              @if (isLoading) {
                <span class="loader"></span>
                در حال ورود...
              } @else {
                ورود
              }
            </button>
          </form>

          <div class="card-footer">
            <p>حساب کاربری ندارید؟</p>
            <a routerLink="/register">ثبت نام کنید</a>
          </div>

          <div class="demo-credentials">
            <p>برای تست:</p>
            <code>test&#64;example.com / 123456</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #F6EBE6 0%, #AEE1F9 100%);
      padding: 2rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      max-width: 420px;
      width: 100%;
    }

    .login-card {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;

      .logo {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h1 {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .form-group {
      margin-bottom: 1.25rem;

      label {
        display: block;
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #4facfe;
        }

        &::placeholder {
          color: #aaa;
        }

        &.error-input {
          border-color: #e74c3c;
        }
      }
    }

    .error {
      display: block;
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    .error-message {
      background: #fee;
      color: #c00;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .loader {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .card-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;

      p {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      a {
        color: #4facfe;
        font-weight: 600;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .demo-credentials {
      text-align: center;
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;

      p {
        font-size: 0.8rem;
        color: #888;
        margin-bottom: 0.5rem;
      }

      code {
        font-size: 0.85rem;
        color: #4facfe;
        background: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe(response => {
        this.isLoading = false;

        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
