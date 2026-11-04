import { Service, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { EditableMember, Member, Photo } from '../../types/member';

@Service()
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}members`);
  }

  getMember(id: string) {
    return this.http.get<Member>(`${this.baseUrl}members/${id}`).pipe(
      tap((member) => this.member.set(member))
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}members/${id}/photos`);
  }

  updateMember(member: EditableMember) {
    return this.http.put(`${this.baseUrl}members`, member);
  }
}
