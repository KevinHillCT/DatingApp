import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs/internal/Observable';
import type { Member } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';

@Component({
  selector: 'app-members-list',
  imports: [AsyncPipe, MemberCard],
  styleUrl: './members-list.css',
  templateUrl: './members-list.html',
})
export class MembersList {
  private memberService = inject(MemberService);
  protected members$: Observable<Member[]>;

  constructor() {
    this.members$ = this.memberService.getMembers();
  }
}
