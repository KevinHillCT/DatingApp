import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FilterModal } from '../filter-modal/filter-modal';
import { MemberParams } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import type { PaginatedResult } from '../../../types/pagination';
import type { Member } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';
import { Paginator } from '../../../shared/paginator/paginator';

@Component({
  selector: 'app-members-list',
  imports: [AsyncPipe, MemberCard, Paginator, FilterModal],
  styleUrl: './members-list.css',
  templateUrl: './members-list.html',
})
export class MembersList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  protected updatedParams = new MemberParams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = {...JSON.parse(filters)};
      this.updatedParams = {...JSON.parse(filters)};
      console.log('Loaded filters from localStorage members-lists:', this.memberParams);
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (result) => {
        this.paginatedMembers.set(result);
      }
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log('Filter modal closed');
  }

  onFilterChange(data: MemberParams) {
    this.memberParams = {...data};
    this.updatedParams = {...data};
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  }

  get displayMessage() {
    const defaultParams = new MemberParams();
    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(`${this.updatedParams.gender}s`);
    } else {
      filters.push('Males, Females');
    }
    if (this.updatedParams.minAge !== defaultParams.minAge ||  this.updatedParams.maxAge !== defaultParams.maxAge) {
      filters.push(`Ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }

    filters.push(this.updatedParams.orderBy === 'lastActive' ? 'Recently Active' : 'Newest Members');
    
    return filters.length > 0 ? `Selected: ${filters.join(' | ')}` : 'All Members';
  }
}
