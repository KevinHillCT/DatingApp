import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  imports: [FormsModule, RouterLink, RouterLinkActive],
  selector: 'app-nav',
  styleUrl: './nav.css',
  templateUrl: './nav.html',
})
export class Nav {
  protected accountService = inject(AccountService);
  protected creds: any = {};
  private router = inject(Router);
  private toast = inject(ToastService);

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigate(['/members']);
        this.toast.success('Login successful');
        this.creds = {};
      },
      error: error => {
        this.toast.error(error.error);
      },
    });
  }
  logout() {
    this.accountService.logout();
    this.creds = {};
    this.router.navigate(['/']);
  }
}
