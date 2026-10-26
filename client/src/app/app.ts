import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import type { User } from '../types/user';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/account-service';
import { Home } from '../features/home/home';

@Component({
  imports: [RouterOutlet, Nav, Home],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected readonly title = 'Dating App';
  protected members = signal<User[]>([]);

  async ngOnInit(): Promise<void> {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    } catch (error) {
      console.error('Failed to get members', error);
      throw error;
    }
  }
}

