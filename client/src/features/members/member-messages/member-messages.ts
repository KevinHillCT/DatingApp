import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, effect } from '@angular/core';
import { PresenceService } from '../../../core/services/presence-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
    imports: [DatePipe, TimeAgoPipe, FormsModule],
    selector: 'app-member-messages',
    styleUrl: './member-messages.css',
    templateUrl: './member-messages.html',
})
export class MemberMessages implements OnInit, OnDestroy {
    @ViewChild('messageEndRef') messageEndRef!: ElementRef;
    protected messageService = inject(MessageService);
    private memberService = inject(MemberService);
    private route = inject(ActivatedRoute);
    protected presenceService = inject(PresenceService);

    protected newMessageContent = '';

    constructor() {
        effect(() => {
            const currentMessages = this.messageService.messageThread();
            if (currentMessages.length > 0) {
                this.scrollToBottom();
            }
        });
    }
    
    ngOnDestroy(): void {
        this.messageService.stopHubConnection();
    }

    ngOnInit(): void {
        this.route.parent?.paramMap.subscribe({
            next: params => {
                const otherUserId = params.get('id');
                if (!otherUserId) throw new Error('Cannot connect to hub');
                this.messageService.createHubConnection(otherUserId);
            },
        });
    }

    sendMessage() {
        const recipientId = this.memberService.member()?.id;
        if (!recipientId) return;
        this.messageService.sendMessage(recipientId, this.newMessageContent)?.then(() => {
            this.newMessageContent = '';
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

