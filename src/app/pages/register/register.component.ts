import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="container">
        <div class="register-card" @slideIn>
          <div class="card-header">
            <div class="logo">🏥</div>
            <h1>ایجاد حساب کاربری</h1>
            <p>برای رزرو نوبت ثبت نام کنید</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>نام و نام خانوادگی</label>
              <input
                type="text"
                formControlName="name"
                placeholder="نام کامل خود را وارد کنید"
                [class.error-input]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
              />
              @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                <span class="error">نام باید حداقل ۳ کاراکتر باشد</span>
              }
            </div>

            <div class="form-group">
              <label>ایمیل</label>
              <input
                type="email"
                formControlName="email"
                placeholder="example@email.com"
                [class.error-input]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <span class="error">ایمیل معتبر وارد کنید</span>
              }
            </div>

            <div class="form-group">
              <label>شماره تماس</label>
              <input
                type="tel"
                formControlName="phone"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                [class.error-input]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
              />
              @if (registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched) {
                <span class="error">شماره تماس معتبر وارد کنید</span>
              }
            </div>

            <div class="form-group">
              <label>رمز عبور</label>
              <input
                type="password"
                formControlName="password"
                placeholder="حداقل ۶ کاراکتر"
                [class.error-input]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <span class="error">رمز عبور باید حداقل ۶ کاراکتر باشد</span>
              }
            </div>

            <div class="form-group">
              <label>تکرار رمز عبور</label>
              <input
                type="password"
                formControlName="confirmPassword"
                placeholder="رمز عبور را تکرار کنید"
                [class.error-input]="registerForm.get('confirmPassword')?.touched && registerForm.hasError('passwordMismatch')"
              />
              @if (registerForm.get('confirmPassword')?.touched && registerForm.hasError('passwordMismatch')) {
                <span class="error">رمز عبور مطابقت ندارد</span>
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
              [disabled]="registerForm.invalid || isLoading"
            >
              @if (isLoading) {
                <span class="loader"></span>
                در حال ثبت نام...
              } @else {
                ثبت نام
              }
            </button>
          </form>

          <div class="card-footer">
            <p>قبلاً ثبت نام کرده‌اید؟</p>
            <a routerLink="/login">وارد شوید</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      padding: 2rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      max-width: 420px;
      width: 100%;
    }

    .register-card {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
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
      margin-bottom: 1rem;

      label {
        display: block;
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.9rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #a8edea;
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
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      color: #333;
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
        box-shadow: 0 10px 30px rgba(168, 237, 234, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .loader {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(51, 51, 51, 0.3);
      border-top-color: #333;
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
        color: #11998e;
        font-weight: 600;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 480px) {
      .register-card {
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9۰-۹]{11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe(response => {
        this.isLoading = false;

        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
