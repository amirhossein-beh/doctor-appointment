import { Injectable } from '@angular/core';
import {BehaviorSubject, from} from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { Booking, TimeSlot } from '../models/booking.model';

interface StoredAppointment extends Booking {
  status: 'upcoming' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private selectedDoctor = new BehaviorSubject<Doctor | null>(null);
  private currentBooking = new BehaviorSubject<Booking | null>(null);
  private appointments: StoredAppointment[] = [];

  selectedDoctor$ = this.selectedDoctor.asObservable();
  currentBooking$ = this.currentBooking.asObservable();

  doctors: Doctor[] = [
    {
      id: 1,
      name: 'دکتر سارا احمدی',
      specialty: 'متخصص قلب و عروق',
      experience: 12,
      rating: 4.9,
      price: 350000,
      photo: 'assets/1.jpg',
      description: 'فوق تخصص قلب و عروق با سابقه درخشان در درمان بیماری‌های قلبی'
    },
    {
      id: 2,
      name: 'دکتر محمد رضایی',
      specialty: 'متخصص پوست و مو',
      experience: 8,
      rating: 4.7,
      price: 280000,
      photo: 'assets/3.jpg',
      description: 'متخصص پوست با تمرکز بر درمان‌های زیبایی و لیزر'
    },
    {
      id: 3,
      name: 'دکتر مریم کریمی',
      specialty: 'متخصص اطفال',
      experience: 15,
      rating: 4.8,
      price: 300000,
      photo: 'assets/2.jpg',
      description: 'فوق تخصص اطفال با تجربه در درمان بیماری‌های کودکان'
    },
    {
      id: 4,
      name: 'دکتر علی محمدی',
      specialty: 'متخصص ارتوپدی',
      experience: 10,
      rating: 4.6,
      price: 400000,
      photo: 'assets/4.jpg',
      description: 'جراح ارتوپد با تخصص در جراحی‌های مفاصل و ستون فقرات'
    }
  ];

  timeSlots: TimeSlot[] = [
    { id: 1, time: '۰۸:۰۰', available: true },
    { id: 2, time: '۰۸:۳۰', available: true },
    { id: 3, time: '۰۹:۰۰', available: false },
    { id: 4, time: '۰۹:۳۰', available: true },
    { id: 5, time: '۱۰:۰۰', available: true },
    { id: 6, time: '۱۰:۳۰', available: false },
    { id: 7, time: '۱۱:۰۰', available: true },
    { id: 8, time: '۱۱:۳۰', available: true },
    { id: 9, time: '۱۴:۰۰', available: true },
    { id: 10, time: '۱۴:۳۰', available: false },
    { id: 11, time: '۱۵:۰۰', available: true },
    { id: 12, time: '۱۵:۳۰', available: true }
  ];

  constructor() {
    this.loadAppointmentsFromStorage();
  }

  private loadAppointmentsFromStorage(): void {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      try {
        this.appointments = JSON.parse(stored);
        this.updateAppointmentStatuses();
      } catch {
        this.appointments = [];
      }
    }
  }

  private saveAppointmentsToStorage(): void {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }

  private updateAppointmentStatuses(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.appointments = this.appointments.map(apt => {
      if (apt.status === 'cancelled') return apt;

      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);

      if (aptDate < today) {
        return { ...apt, status: 'completed' as const };
      }
      return { ...apt, status: 'upcoming' as const };
    });

    this.saveAppointmentsToStorage();
  }

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  getDoctorById(id: number): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }

  getTimeSlots(): TimeSlot[] {
    return this.timeSlots;
  }

  setSelectedDoctor(doctor: Doctor): void {
    this.selectedDoctor.next(doctor);
  }

  getSelectedDoctor(): Doctor | null {
    return this.selectedDoctor.getValue();
  }

  createBooking(booking: Booking, userId?: number): void {
    const storedAppointment: StoredAppointment = {
      ...booking,
      userId,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    this.appointments.push(storedAppointment);
    this.saveAppointmentsToStorage();
    this.currentBooking.next(booking);
  }

  getCurrentBooking(): Booking | null {
    return this.currentBooking.getValue();
  }

  getUserAppointments(userId: number): StoredAppointment[] {
    this.updateAppointmentStatuses();
    return this.appointments
      .filter(apt => apt.userId === userId)
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  }

  getAllAppointments(): StoredAppointment[] {
    this.updateAppointmentStatuses();
    return this.appointments;
  }

  cancelAppointment(trackingCode: string): boolean {
    const index = this.appointments.findIndex(apt => apt.trackingCode === trackingCode);
    if (index !== -1) {
      this.appointments[index].status = 'cancelled';
      this.saveAppointmentsToStorage();
      return true;
    }
    return false;
  }

  getAppointmentByTrackingCode(trackingCode: string): StoredAppointment | undefined {
    return this.appointments.find(apt => apt.trackingCode === trackingCode);
  }

  generateTrackingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DR-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  }
}
