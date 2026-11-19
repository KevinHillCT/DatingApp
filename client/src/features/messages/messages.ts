import { Component, inject, signal, OnInit } from '@angular/core';
import { ConfirmDialogService } from '../../core/services/confirm-dialog-service';
import { DatePipe } from '@angular/common';
import { MessageService } from '../../core/services/message-service';
import { Message } from '../../types/message';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';
import { RouterLink } from '@angular/router';

@Component({
  imports: [Paginator, RouterLink, DatePipe],
  selector: 'app-messages',
  styleUrl: './messages.css',
  templateUrl: './messages.html',
})
export class Messages implements OnInit {
  private messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmDialogService);
  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageNumber = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<PaginatedResult<Message> | null>(null);

  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages() {
    this.messageService
      .getMessages(this.container, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.paginatedMessages.set(response);
        this.fetchedContainer = this.container;
      });
  }

  async confirmDelete(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmDialogService.confirm('Are you sure you want to delete this message?');
    if (ok) {
      this.deleteMessage(id);
    }
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        const current = this.paginatedMessages();
        if (current?.items) {
          this.paginatedMessages.update((prev) => {
            if (!prev) return null;
            const newItems = prev.items.filter((m) => m.id !== id) || [];
            return {
              items: newItems,
              metadata: prev.metadata,
            };
          });
        }
      }
    });
  }

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }

  setContainer(container: string) {
    this.container = container;
    this.loadMessages();
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }
}
