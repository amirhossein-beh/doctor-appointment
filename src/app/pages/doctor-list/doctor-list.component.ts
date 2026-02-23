import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { BookingService } from '../../services/booking.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doctor-list-page">
      <div class="container">
        <header class="page-header" @fadeIn>
          <h1>رزرو نوبت پزشک</h1>
          <p>بهترین پزشکان را انتخاب کنید و نوبت خود را رزرو کنید</p>
        </header>

        <div class="doctors-grid" @staggerAnimation>
          @for (doctor of doctors; track doctor.id) {
            <div class="doctor-card" @scaleIn>
              <div class="doctor-image">
                <img [src]="doctor.photo" [alt]="doctor.name" />
                <div class="rating">
                  <span class="star">★</span>
                  <span>{{ doctor.rating }}</span>
                </div>
              </div>
              <div class="doctor-info">
                <h3>{{ doctor.name }}</h3>
                <p class="specialty">{{ doctor.specialty }}</p>
                <p class="experience">{{ doctor.experience }} سال تجربه</p>
                <p class="description">{{ doctor.description }}</p>
                <div class="card-footer">
                  <span class="price">{{ formatPrice(doctor.price) }}</span>
                  <button class="book-btn" (click)="selectDoctor(doctor)">
                    رزرو نوبت
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doctor-list-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #F6EBE6 0%, #AEE1F9 100%);
      padding: 2rem 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      }

      p {
        font-size: 1.1rem;
        opacity: 0.9;
      }
    }

    .doctors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .doctor-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
      }
    }

    .doctor-image {
      position: relative;
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .doctor-card:hover & img {
        transform: scale(1.1);
      }

      .rating {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: rgba(255, 255, 255, 0.95);
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.25rem;

        .star {
          color: #ffc107;
        }
      }
    }

    .doctor-info {
      padding: 1.5rem;

      h3 {
        font-size: 1.3rem;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .specialty {
        color: #667eea;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .experience {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .description {
        color: #888;
        font-size: 0.85rem;
        line-height: 1.5;
        margin-bottom: 1rem;
      }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;

      .price {
        font-weight: bold;
        color: #333;
        font-size: 0.95rem;
      }

      .book-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        font-family: inherit;

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 1.8rem;
      }

      .doctors-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
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
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctors = this.bookingService.getDoctors();
  }

  selectDoctor(doctor: Doctor): void {
    this.bookingService.setSelectedDoctor(doctor);
    this.router.navigate(['/booking', doctor.id]);
  }

  formatPrice(price: number): string {
    return this.bookingService.formatPrice(price);
  }
}
