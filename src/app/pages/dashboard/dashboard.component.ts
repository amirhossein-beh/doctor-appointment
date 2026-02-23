import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { User } from '../../models/user.model';
import { Booking } from '../../models/booking.model';

interface AppointmentWithStatus extends Booking {
  status: 'upcoming' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <header class="page-header" @fadeIn>
          <h1>داشبورد من</h1>
          <p>مدیریت نوبت‌ها و اطلاعات شخصی</p>
        </header>

        @if (user) {
          <!-- Statistics Cards -->
          <div class="stats-grid" @staggerAnimation>
            <div class="stat-card">
              <div class="stat-icon total">📋</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.total }}</span>
                <span class="stat-label">کل نوبت‌ها</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon upcoming">📅</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.upcoming }}</span>
                <span class="stat-label">نوبت‌های پیش رو</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon completed">✅</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.completed }}</span>
                <span class="stat-label">تکمیل شده</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon cancelled">❌</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.cancelled }}</span>
                <span class="stat-label">لغو شده</span>
              </div>
            </div>
          </div>

          <!-- Profile Section -->
          <section class="dashboard-section" @slideIn>
            <h2>
              <span class="section-icon">👤</span>
              اطلاعات شخصی
            </h2>
            <div class="profile-card">
              <div class="profile-avatar">
                {{ user.name.charAt(0) }}
              </div>
              <div class="profile-info">
                <div class="info-item">
                  <span class="label">نام:</span>
                  <span class="value">{{ user.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">ایمیل:</span>
                  <span class="value">{{ user.email }}</span>
                </div>
                <div class="info-item">
                  <span class="label">تلفن:</span>
                  <span class="value">{{ user.phone }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Upcoming Appointments -->
          <section class="dashboard-section" @slideIn>
            <h2>
              <span class="section-icon">📅</span>
              نوبت‌های پیش رو
            </h2>
            @if (upcomingAppointments.length > 0) {
              <div class="appointments-list">
                @for (appointment of upcomingAppointments; track appointment.trackingCode) {
                  <div class="appointment-card upcoming">
                    <div class="appointment-header">
                      <span class="status-badge upcoming">پیش رو</span>
                      <span class="tracking-code">{{ appointment.trackingCode }}</span>
                    </div>
                    <div class="appointment-body">
                      <div class="doctor-info">
                        <h4>{{ appointment.doctorName }}</h4>
                        <p>{{ appointment.specialty }}</p>
                      </div>
                      <div class="appointment-details">
                        <div class="detail">
                          <span class="icon">📅</span>
                          <span>{{ formatDate(appointment.date) }}</span>
                        </div>
                        <div class="detail">
                          <span class="icon">⏰</span>
                          <span>{{ appointment.time }}</span>
                        </div>
                        <div class="detail">
                          <span class="icon">💰</span>
                          <span>{{ formatPrice(appointment.price) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="appointment-actions">
                      <button class="cancel-btn" (click)="cancelAppointment(appointment)">
                        لغو نوبت
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>نوبت پیش رویی ندارید</p>
                <button class="book-now-btn" (click)="goToBooking()">
                  رزرو نوبت جدید
                </button>
              </div>
            }
          </section>

          <!-- Recent Appointments -->
          <section class="dashboard-section" @slideIn>
            <h2>
              <span class="section-icon">📜</span>
              نوبت‌های اخیر
            </h2>
            @if (recentAppointments.length > 0) {
              <div class="appointments-list">
                @for (appointment of recentAppointments; track appointment.trackingCode) {
                  <div class="appointment-card" [class.completed]="appointment.status === 'completed'" [class.cancelled]="appointment.status === 'cancelled'">
                    <div class="appointment-header">
                      <span class="status-badge" [class.completed]="appointment.status === 'completed'" [class.cancelled]="appointment.status === 'cancelled'">
                        {{ appointment.status === 'completed' ? 'تکمیل شده' : 'لغو شده' }}
                      </span>
                      <span class="tracking-code">{{ appointment.trackingCode }}</span>
                    </div>
                    <div class="appointment-body">
                      <div class="doctor-info">
                        <h4>{{ appointment.doctorName }}</h4>
                        <p>{{ appointment.specialty }}</p>
                      </div>
                      <div class="appointment-details">
                        <div class="detail">
                          <span class="icon">📅</span>
                          <span>{{ formatDate(appointment.date) }}</span>
                        </div>
                        <div class="detail">
                          <span class="icon">⏰</span>
                          <span>{{ appointment.time }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>سابقه‌ای از نوبت‌ها موجود نیست</p>
              </div>
            }
          </section>

          <!-- Book New Appointment Button -->
          <div class="floating-action">
            <button class="fab" (click)="goToBooking()">
              <span>+</span>
              رزرو نوبت جدید
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #F6EBE6 0%, #AEE1F9 100%);
      padding: 2rem 1rem 6rem;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      color: white;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      }

      p {
        font-size: 1rem;
        opacity: 0.9;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;

        &.total { background: #e3f2fd; }
        &.upcoming { background: #fff3e0; }
        &.completed { background: #e8f5e9; }
        &.cancelled { background: #ffebee; }
      }

      .stat-info {
        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #888;
        }
      }
    }

    .dashboard-section {
      background: white;
      border-radius: 20px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 1.1rem;
        color: #333;
        margin-bottom: 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .section-icon {
          font-size: 1.25rem;
        }
      }
    }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      .profile-avatar {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        font-weight: bold;
      }

      .profile-info {
        flex: 1;

        .info-item {
          display: flex;
          margin-bottom: 0.5rem;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            color: #888;
            font-size: 0.9rem;
            min-width: 60px;
          }

          .value {
            color: #333;
            font-weight: 500;
          }
        }
      }
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .appointment-card {
      border: 2px solid #e0e0e0;
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      &.upcoming {
        border-color: #ffc107;
      }

      &.completed {
        border-color: #4caf50;
      }

      &.cancelled {
        border-color: #f44336;
        opacity: 0.7;
      }
    }

    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;

      .tracking-code {
        font-family: monospace;
        font-size: 0.85rem;
        color: #666;
      }
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;

      &.upcoming {
        background: #fff3e0;
        color: #f57c00;
      }

      &.completed {
        background: #e8f5e9;
        color: #388e3c;
      }

      &.cancelled {
        background: #ffebee;
        color: #d32f2f;
      }
    }

    .appointment-body {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .doctor-info {
        h4 {
          font-size: 1rem;
          color: #333;
          margin-bottom: 0.25rem;
        }

        p {
          font-size: 0.85rem;
          color: #666;
        }
      }

      .appointment-details {
        display: flex;
        gap: 1rem;

        .detail {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: #555;

          .icon {
            font-size: 1rem;
          }
        }
      }
    }

    .appointment-actions {
      padding: 0.75rem 1rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;

      .cancel-btn {
        padding: 0.5rem 1rem;
        background: white;
        color: #f44336;
        border: 2px solid #f44336;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #f44336;
          color: white;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #888;

      .empty-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1rem;
      }

      .book-now-btn {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%);
        color: white;
        border: none;
        border-radius: 25px;
        font-family: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .floating-action {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);

      .fab {
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
        border: none;
        border-radius: 30px;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(17, 153, 142, 0.4);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        span {
          font-size: 1.25rem;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(17, 153, 142, 0.5);
        }
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .appointment-body {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;

        .appointment-details {
          flex-wrap: wrap;
        }
      }

      .profile-card {
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .page-header h1 {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;

        .stat-icon {
          width: 40px;
          height: 40px;
          font-size: 1.2rem;
        }

        .stat-info .stat-value {
          font-size: 1.25rem;
        }
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  appointments: AppointmentWithStatus[] = [];
  upcomingAppointments: AppointmentWithStatus[] = [];
  recentAppointments: AppointmentWithStatus[] = [];
  stats = {
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadAppointments();
  }

  loadAppointments(): void {
    if (this.user) {
      this.appointments = this.bookingService.getUserAppointments(this.user.id);

      this.upcomingAppointments = this.appointments.filter(a => a.status === 'upcoming');
      this.recentAppointments = this.appointments.filter(a => a.status !== 'upcoming');

      this.stats = {
        total: this.appointments.length,
        upcoming: this.upcomingAppointments.length,
        completed: this.appointments.filter(a => a.status === 'completed').length,
        cancelled: this.appointments.filter(a => a.status === 'cancelled').length
      };
    }
  }

  cancelAppointment(appointment: AppointmentWithStatus): void {
    if (confirm('آیا از لغو این نوبت اطمینان دارید؟')) {
      this.bookingService.cancelAppointment(appointment.trackingCode);
      this.loadAppointments();
    }
  }

  goToBooking(): void {
    this.router.navigate(['/']);
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

  formatPrice(price: number): string {
    return this.bookingService.formatPrice(price);
  }
}
