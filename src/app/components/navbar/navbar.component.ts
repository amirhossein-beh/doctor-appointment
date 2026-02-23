import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <span class="logo">🏥</span>
          <span class="brand-text">نوبت دهی آنلاین</span>
        </a>

        <div class="nav-links">
          @if (isAuthenticated$ | async) {
            @if (currentUser$ | async; as user) {
              <div class="user-menu">
                <span class="user-name">
                  <span class="user-icon">👤</span>
                  {{ user.name }}
                </span>
                <div class="dropdown">
                  <a routerLink="/dashboard" class="dropdown-item">
                    <span>📊</span> داشبورد
                  </a>
                  <button (click)="logout()" class="dropdown-item logout">
                    <span>🚪</span> خروج
                  </button>
                </div>
              </div>
            }
          } @else {
            <a routerLink="/login" class="nav-link">ورود</a>
            <a routerLink="/register" class="nav-link register">ثبت نام</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      .logo {
        font-size: 1.75rem;
      }

      .brand-text {
        font-size: 1.1rem;
        font-weight: 700;
        color: #333;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-link {
      padding: 0.5rem 1rem;
      color: #555;
      text-decoration: none;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }

      &.register {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
      }
    }

    .user-menu {
      position: relative;

      .user-name {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #f8f9fa;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 500;
        color: #333;
        transition: background 0.3s ease;

        .user-icon {
          font-size: 1.2rem;
        }

        &:hover {
          background: #e9ecef;
        }
      }

      .dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }

      &:hover .dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: #333;
        text-decoration: none;
        border: none;
        background: none;
        width: 100%;
        font-family: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s ease;

        &:first-child {
          border-radius: 12px 12px 0 0;
        }

        &:last-child {
          border-radius: 0 0 12px 12px;
        }

        &:hover {
          background: #f8f9fa;
        }

        &.logout {
          color: #e74c3c;

          &:hover {
            background: #fee;
          }
        }
      }
    }

    @media (max-width: 600px) {
      .nav-container {
        padding: 0.75rem 1rem;
      }

      .brand-text {
        display: none;
      }

      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
      }

      .user-menu .user-name {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class NavbarComponent {
  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
