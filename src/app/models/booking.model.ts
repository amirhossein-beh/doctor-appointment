export interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

export interface Booking {
  trackingCode: string;
  doctorId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  description: string;
  price: number;
  userId?: number;
  status?: 'upcoming' | 'completed' | 'cancelled';
  createdAt?: string;
}
