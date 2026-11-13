import { Component, input, inject, computed } from '@angular/core';
import { LikesService } from '../../../core/services/likes-service';
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
  member = input.required<Member>();
  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));

  toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(id => id !== this.member().id));
        } else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id]);
        }
      }
    });
  }
}
