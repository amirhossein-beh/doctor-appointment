import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      name: 'کاربر نمونه',
      email: 'test@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      password: '123456',
      createdAt: new Date('2024-01-01')
    }
  ];

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return of(credentials).pipe(
      delay(800),
      map(creds => {
        const user = this.users.find(
          u => u.email === creds.email && u.password === creds.password
        );

        if (user) {
          const token = this.generateToken();
          const userWithoutPassword = { ...user };
          delete userWithoutPassword.password;

          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));

          this.currentUserSubject.next(userWithoutPassword);
          this.isAuthenticatedSubject.next(true);

          return {
            success: true,
            message: 'ورود با موفقیت انجام شد',
            token,
            user: userWithoutPassword
          };
        } else {
          return {
            success: false,
            message: 'ایمیل یا رمز عبور اشتباه است'
          };
        }
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return of(data).pipe(
      delay(800),
      map(regData => {
        const existingUser = this.users.find(u => u.email === regData.email);

        if (existingUser) {
          return {
            success: false,
            message: 'این ایمیل قبلاً ثبت شده است'
          };
        }

        const newUser: User = {
          id: this.users.length + 1,
          name: regData.name,
          email: regData.email,
          phone: regData.phone,
          password: regData.password,
          createdAt: new Date()
        };

        this.users.push(newUser);

        const token = this.generateToken();
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));

        this.currentUserSubject.next(userWithoutPassword);
        this.isAuthenticatedSubject.next(true);

        return {
          success: true,
          message: 'ثبت نام با موفقیت انجام شد',
          token,
          user: userWithoutPassword
        };
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  private generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}
