import { Component, input, inject, computed } from '@angular/core';
import { LikesService } from '../../../core/services/likes-service';
import { PresenceService } from '../../../core/services/presence-service';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  imports: [RouterLink, AgePipe],
  selector: 'app-member-card',
  styleUrl: './member-card.css',
  templateUrl: './member-card.html',
})

export class MemberCard {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  member = input.required<Member>();
  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));
  protected isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member().id));

  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id);
  }
}
