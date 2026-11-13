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
    return this.http.post<User>(`${this.baseUrl}account/register`, creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
          this.likesService.clearLikeIds();
        }
      }),
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(`${this.baseUrl}account/login`, creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
          this.likesService.getLikeIds();
        }
      }),
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
  }
}
