import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AsyncPipe } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';
import type { Member } from '../../../types/member';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { filter } from 'rxjs';

@Component({
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  selector: 'app-member-detailed',
  styleUrl: './member-detailed.css',
  templateUrl: './member-detailed.html',
})
export class MemberDetailed implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');

  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  });

  ngOnInit(): void {
    this.title.set(this.memberService.editMode() ? 'Edit Profile' : this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.memberService.editMode() ? 'Edit Profile' : this.route.firstChild?.snapshot?.title);
      },
    });
  }
}
