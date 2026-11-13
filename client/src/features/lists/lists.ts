import { Component, inject, signal, OnInit, input } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member, LikesParams } from '../../types/member';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  imports: [MemberCard, Paginator],
  selector: 'app-lists',
  styleUrl: './lists.css',
  templateUrl: './lists.html',
})
export class Lists implements OnInit {
  private likeService = inject(LikesService);
  protected members = signal<Member[]>([]);
  protected predicate = 'liked';
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected likesParams = new LikesParams();

  tabs = [
    { label: 'Liked', predicate: 'liked' },
    { label: 'Likes Me', predicate: 'likedBy' },
    { label: 'Mutual', predicate: 'mutual' },
  ];

  constructor() {
    const filters = localStorage.getItem('likesFilters');
    if (filters) {
      this.likesParams = {...JSON.parse(filters)};
    }
    if (this.likesParams.memberId == '' || this.likesParams.memberId == null) {
      this.likesParams.memberId = '';
    }
  }

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    if (this.likesParams.predicate != predicate) {
      this.likesParams.predicate = predicate;
      this.likesParams.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes() {
    this.likeService.getLikes(this.likesParams).subscribe({
      next: (result) => {
        this.paginatedMembers.set(result);
      },
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.likesParams.pageNumber = event.pageNumber;
    this.likesParams.pageSize = event.pageSize;
    this.loadLikes();
  }
}
