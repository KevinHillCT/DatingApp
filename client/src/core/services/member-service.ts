import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { Member, Photo } from '../../types/member';

@Service()
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}members`);
  }

  getMember(id: string) {
    return this.http.get<Member>(`${this.baseUrl}members/${id}`);
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}members/${id}/photos`);
  }
}
