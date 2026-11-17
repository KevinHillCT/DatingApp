import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { LikesService } from './likes-service';
import type { RegisterCreds, LoginCreds } from '../../types/user';
import { tap } from 'rxjs/operators';
import { User } from '../../types/user';
import { environment } from '../../environments/environment';

@Service()
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http
      .post<User>(`${this.baseUrl}account/register`, creds, { withCredentials: true })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
            this.likesService.clearLikeIds();
          }
        }),
      );
  }

  login(creds: LoginCreds) {
    return this.http
      .post<User>(`${this.baseUrl}account/login`, creds, { withCredentials: true })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
            this.likesService.getLikeIds();
          }
        }),
      );
  }

  refreshToken() {
    return this.http.post<User>(
      `${this.baseUrl}account/refresh-token`,
      {},
      { withCredentials: true },
    );
  }

  startTokenRefreshInterval() {
    setInterval(
      () => {
        this.http
          .post<User>(`${this.baseUrl}account/refresh-token`, {}, { withCredentials: true })
          .subscribe({
            next: (user) => {
              this.setCurrentUser(user);
            },
            error: () => {
              console.error('Failed to refresh token');
              this.logout();
            },
          });
      },
      5 * 60 * 1000,
    );
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
  }

  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
