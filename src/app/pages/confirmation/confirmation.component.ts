import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-page">
      <div class="container">
        @if (booking) {
          <div class="confirmation-card" @bounceIn>
            <div class="success-icon" @pulse>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h1>نوبت شما با موفقیت ثبت شد!</h1>
            <p class="subtitle">اطلاعات رزرو به ایمیل شما ارسال خواهد شد</p>

            <div class="tracking-code" @fadeIn>
              <span class="label">کد پیگیری</span>
              <span class="code">{{ booking.trackingCode }}</span>
            </div>

            <div class="booking-details">
              <div class="detail-item">
                <span class="icon">👨‍⚕️</span>
                <div class="detail-content">
                  <span class="label">پزشک</span>
                  <span class="value">{{ booking.doctorName }}</span>
                  <span class="sub-value">{{ booking.specialty }}</span>
                </div>
              </div>

              <div class="detail-item">
                <span class="icon">📅</span>
                <div class="detail-content">
                  <span class="label">تاریخ و ساعت</span>
                  <span class="value">{{ formatDate(booking.date) }}</span>
                  <span class="sub-value">ساعت {{ booking.time }}</span>
                </div>
              </div>

              <div class="detail-item">
                <span class="icon">👤</span>
                <div class="detail-content">
                  <span class="label">بیمار</span>
                  <span class="value">{{ booking.patientName }}</span>
                  <span class="sub-value">{{ booking.patientPhone }}</span>
                </div>
              </div>

              <div class="detail-item">
                <span class="icon">📧</span>
                <div class="detail-content">
                  <span class="label">ایمیل</span>
                  <span class="value">{{ booking.patientEmail }}</span>
                </div>
              </div>

              @if (booking.description) {
                <div class="detail-item">
                  <span class="icon">📝</span>
                  <div class="detail-content">
                    <span class="label">توضیحات</span>
                    <span class="value description">{{ booking.description }}</span>
                  </div>
                </div>
              }

              <div class="detail-item total">
                <span class="icon">💰</span>
                <div class="detail-content">
                  <span class="label">هزینه ویزیت</span>
                  <span class="value price">{{ formatPrice(booking.price) }}</span>
                </div>
              </div>
            </div>

            <div class="actions">
              <button class="home-btn" (click)="goHome()">
                بازگشت به صفحه اصلی
              </button>
              <button class="print-btn" (click)="print()">
                چاپ رسید
              </button>
            </div>

            @if (isAuthenticated) {
              <div class="dashboard-action">
                <button class="dashboard-btn" (click)="goDashboard()">
                  📊 مشاهده داشبورد من
                </button>
              </div>
            }

            <div class="footer-note">
              <p>لطفاً ۱۵ دقیقه قبل از زمان نوبت در مطب حضور داشته باشید</p>
              <p>در صورت نیاز به لغو نوبت، با شماره پشتیبانی تماس بگیرید</p>
            </div>
          </div>
        } @else {
          <div class="no-booking" @fadeIn>
            <h2>اطلاعات رزرو یافت نشد</h2>
            <p>لطفاً ابتدا یک نوبت رزرو کنید</p>
            <button class="home-btn" (click)="goHome()">بازگشت به صفحه اصلی</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 2rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      max-width: 500px;
      width: 100%;
    }

    .confirmation-card {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      text-align: center;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;

      svg {
        width: 40px;
        height: 40px;
        color: white;
      }
    }

    h1 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .tracking-code {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 1.5rem;
      border-radius: 16px;
      margin-bottom: 1.5rem;

      .label {
        display: block;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
      }

      .code {
        display: block;
        color: white;
        font-size: 1.8rem;
        font-weight: bold;
        letter-spacing: 2px;
      }
    }

    .booking-details {
      text-align: right;
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      &.total {
        background: #f8f9fa;
        margin: 0 -1.5rem;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border-bottom: none;
      }

      .icon {
        font-size: 1.5rem;
        min-width: 40px;
        text-align: center;
      }

      .detail-content {
        flex: 1;

        .label {
          display: block;
          color: #888;
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
        }

        .value {
          display: block;
          color: #333;
          font-weight: 600;
          font-size: 0.95rem;

          &.description {
            font-weight: normal;
            color: #555;
          }

          &.price {
            color: #f5576c;
            font-size: 1.1rem;
          }
        }

        .sub-value {
          display: block;
          color: #666;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .home-btn, .print-btn {
      flex: 1;
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .home-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4);
      }
    }

    .print-btn {
      background: white;
      color: #333;
      border: 2px solid #e0e0e0;

      &:hover {
        border-color: #f5576c;
        color: #f5576c;
      }
    }

    .dashboard-action {
      margin-bottom: 1.5rem;

      .dashboard-btn {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(95, 114, 189, 0.4);
        }
      }
    }

    .footer-note {
      padding-top: 1rem;
      border-top: 1px dashed #e0e0e0;

      p {
        color: #888;
        font-size: 0.8rem;
        margin: 0.5rem 0;
      }
    }

    .no-booking {
      text-align: center;
      color: white;
      padding: 3rem;

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1.5rem;
      }

      .home-btn {
        display: inline-block;
      }
    }

    @media (max-width: 480px) {
      .confirmation-card {
        padding: 1.5rem;
      }

      .tracking-code .code {
        font-size: 1.4rem;
      }

      .actions {
        flex-direction: column;
      }

      h1 {
        font-size: 1.3rem;
      }
    }
  `],
  animations: [
    trigger('bounceIn', [
      transition(':enter', [
        animate('800ms ease-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.3)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.05)', offset: 0.5 }),
          style({ transform: 'scale(0.95)', offset: 0.7 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('pulse', [
      transition(':enter', [
        animate('1000ms 500ms ease-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms 300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ConfirmationComponent implements OnInit {
  booking: Booking | null = null;
  isAuthenticated = false;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.booking = this.bookingService.getCurrentBooking();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  formatPrice(price: number): string {
    return this.bookingService.formatPrice(price);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'persian'
    };
    return date.toLocaleDateString('fa-IR', options);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  print(): void {
    window.print();
  }
}
