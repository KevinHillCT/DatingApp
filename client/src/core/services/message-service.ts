import { Service } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../../types/message';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../../types/pagination';
    
@Service()
export class MessageService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient)

    getMessages(container: string, pageNumber: number, pageSize: number){
        let params = new HttpParams();
        params = params.append('container', container);
        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());
        return this.http.get<PaginatedResult<Message>>(`${this.baseUrl}messages`, { params });
    }

    getMessageThread(memberId: string){
        return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${memberId}`);
    }

    sendMessage(recipientId: string, content: string){
        return this.http.post<Message>(`${this.baseUrl}messages`, { recipientId, content });
    }

    deleteMessage(id: string){
        return this.http.delete(`${this.baseUrl}messages/${id}`);
    }
}
