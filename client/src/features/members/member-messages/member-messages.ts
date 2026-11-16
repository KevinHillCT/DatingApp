import {
  Component,
  inject,
  signal,
  OnInit,
  viewChild,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  selector: 'app-member-messages',
  styleUrl: './member-messages.css',
  templateUrl: './member-messages.html',
})
export class MemberMessages implements OnInit {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  private messageService = inject(MessageService);
  private memberService = inject(MemberService);
  protected messages = signal<Message[]>([]);
  protected newMessageContent = '';

  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    // Load initial messages here if needed
    this.loadMessages();
  }

  private loadMessages() {
    const memberId = this.memberService.member()?.id;
    if (memberId) {
      this.messageService.getMessageThread(memberId).subscribe({
        next: (messages) =>
          this.messages.set(
            messages.map((m) => ({
              ...m,
              currentUserSender: m.senderId !== memberId,
            })),
          ),
      });
    }
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    this.messageService.sendMessage(recipientId, this.newMessageContent).subscribe({
      next: (message) => {
        this.messages.update((messages) => {
          message.currentUserSender = true;
          return [...messages, message];
        });
        this.newMessageContent = '';
      },
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
