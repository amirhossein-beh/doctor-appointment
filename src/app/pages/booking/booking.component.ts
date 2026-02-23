import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Doctor } from '../../models/doctor.model';
import { TimeSlot, Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="booking-page">
      <div class="container">
        <button class="back-btn" (click)="goBack()">
          → بازگشت
        </button>

        @if (doctor) {
          <div class="booking-content" @slideIn>
            <div class="doctor-summary">
              <img [src]="doctor.photo" [alt]="doctor.name" />
              <div class="doctor-details">
                <h2>{{ doctor.name }}</h2>
                <p class="specialty">{{ doctor.specialty }}</p>
                <p class="price">هزینه ویزیت: {{ formatPrice(doctor.price) }}</p>
              </div>
            </div>

            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
              <div class="form-section">
                <h3>انتخاب تاریخ</h3>
                <div class="date-picker">
                  <input
                    type="date"
                    formControlName="date"
                    [min]="minDate"
                    class="date-input"
                  />
                  @if (bookingForm.get('date')?.invalid && bookingForm.get('date')?.touched) {
                    <span class="error">لطفاً تاریخ را انتخاب کنید</span>
                  }
                </div>
              </div>

              <div class="form-section">
                <h3>انتخاب ساعت</h3>
                <div class="time-slots">
                  @for (slot of timeSlots; track slot.id) {
                    <button
                      type="button"
                      class="time-slot"
                      [class.selected]="selectedTime === slot.time"
                      [class.unavailable]="!slot.available"
                      [disabled]="!slot.available"
                      (click)="selectTime(slot)"
                    >
                      {{ slot.time }}
                    </button>
                  }
                </div>
                @if (bookingForm.get('time')?.invalid && bookingForm.get('time')?.touched) {
                  <span class="error">لطفاً ساعت را انتخاب کنید</span>
                }
              </div>

              <div class="form-section">
                <h3>اطلاعات بیمار</h3>

                <div class="form-group">
                  <label>نام و نام خانوادگی</label>
                  <input
                    type="text"
                    formControlName="patientName"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                  @if (bookingForm.get('patientName')?.invalid && bookingForm.get('patientName')?.touched) {
                    <span class="error">نام الزامی است</span>
                  }
                </div>

                <div class="form-group">
                  <label>شماره تماس</label>
                  <input
                    type="tel"
                    formControlName="patientPhone"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                  @if (bookingForm.get('patientPhone')?.invalid && bookingForm.get('patientPhone')?.touched) {
                    <span class="error">شماره تماس معتبر وارد کنید</span>
                  }
                </div>

                <div class="form-group">
                  <label>ایمیل</label>
                  <input
                    type="email"
                    formControlName="patientEmail"
                    placeholder="example@email.com"
                  />
                  @if (bookingForm.get('patientEmail')?.invalid && bookingForm.get('patientEmail')?.touched) {
                    <span class="error">ایمیل معتبر وارد کنید</span>
                  }
                </div>

                <div class="form-group">
                  <label>توضیحات (اختیاری)</label>
                  <textarea
                    formControlName="description"
                    placeholder="علائم یا توضیحات اضافی..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                class="submit-btn"
                [disabled]="bookingForm.invalid"
              >
                تایید و رزرو نوبت
              </button>
            </form>
          </div>
        } @else {
          <div class="not-found" @fadeIn>
            <h2>پزشک یافت نشد</h2>
            <p>لطفاً از صفحه اصلی پزشک مورد نظر را انتخاب کنید</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      padding: 2rem 1rem;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .booking-content {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .doctor-summary {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 1.5rem;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }

      .doctor-details {
        h2 {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .specialty {
          color: #11998e;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .price {
          color: #666;
          font-size: 0.85rem;
        }
      }
    }

    .form-section {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1rem;
        color: #333;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
      }
    }

    .date-picker {
      .date-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease;

        &:focus {
          outline: none;
          border-color: #11998e;
        }
      }
    }

    .time-slots {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }

    .time-slot {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        border-color: #11998e;
        background: rgba(17, 153, 142, 0.1);
      }

      &.selected {
        background: #11998e;
        border-color: #11998e;
        color: white;
      }

      &.unavailable {
        background: #f5f5f5;
        color: #ccc;
        cursor: not-allowed;
        text-decoration: line-through;
      }
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 0.5rem;
      }

      input, textarea {
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
          border-color: #11998e;
        }

        &::placeholder {
          color: #aaa;
        }
      }

      textarea {
        resize: vertical;
      }
    }

    .error {
      display: block;
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(17, 153, 142, 0.4);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .not-found {
      text-align: center;
      color: white;
      padding: 3rem;

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
    }

    @media (max-width: 480px) {
      .time-slots {
        grid-template-columns: repeat(3, 1fr);
      }

      .doctor-summary {
        flex-direction: column;
        text-align: center;
      }

      .booking-content {
        padding: 1.5rem;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BookingComponent implements OnInit {
  doctor: Doctor | null = null;
  timeSlots: TimeSlot[] = [];
  selectedTime: string = '';
  bookingForm: FormGroup;
  minDate: string;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      patientPhone: ['', [Validators.required, Validators.pattern(/^[0-9۰-۹]{11}$/)]],
      patientEmail: ['', [Validators.required, Validators.email]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.doctor = this.bookingService.getDoctorById(doctorId) || null;
    this.timeSlots = this.bookingService.getTimeSlots();
  }

  selectTime(slot: TimeSlot): void {
    if (slot.available) {
      this.selectedTime = slot.time;
      this.bookingForm.patchValue({ time: slot.time });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return this.bookingService.formatPrice(price);
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.doctor) {
      const formValue = this.bookingForm.value;

      const booking: Booking = {
        trackingCode: this.bookingService.generateTrackingCode(),
        doctorId: this.doctor.id,
        doctorName: this.doctor.name,
        specialty: this.doctor.specialty,
        date: formValue.date,
        time: formValue.time,
        patientName: formValue.patientName,
        patientPhone: formValue.patientPhone,
        patientEmail: formValue.patientEmail,
        description: formValue.description,
        price: this.doctor.price
      };

      const user = this.authService.getCurrentUser();
      this.bookingService.createBooking(booking, user?.id);
      this.router.navigate(['/confirmation']);
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }
}
