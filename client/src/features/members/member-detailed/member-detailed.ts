import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PresenceService } from '../../../core/services/presence-service';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
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
import { LikesService } from '../../../core/services/likes-service';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  selector: 'app-member-detailed',
  styleUrl: './member-detailed.css',
  templateUrl: './member-detailed.html',
})
export class MemberDetailed implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService);
  protected presenceService = inject(PresenceService);
  protected likeService = inject(LikesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeId = signal<string | null>(null);
  protected title = signal<string | undefined>('Profile');
  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.routeId()!));

  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId();
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.routeId.set(params.get('id'));
    });
  }

  ngOnInit(): void {
    this.title.set(this.memberService.editMode() ? 'Edit Profile' : this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.memberService.editMode() ? 'Edit Profile' : this.route.firstChild?.snapshot?.title);
      },
    });
  }
}
