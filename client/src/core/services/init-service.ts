import { Service, inject } from '@angular/core';
import { AccountService } from './account-service';
import { LikesService } from './likes-service';
import { of } from 'rxjs';

@Service()
export class InitService {
  private accountService = inject(AccountService);
  private likeService = inject(LikesService);

  init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.likeService.getLikeIds();

    return of(null);
  }
}
