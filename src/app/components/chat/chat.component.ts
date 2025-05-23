import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAIService } from '../../services/openai.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';
  isLoading = false;

  constructor(private openaiService: OpenAIService) {}

  ngOnInit(): void {
    this.messages.push({
      role: 'assistant',
      content: 'How can I help you today?',
      timestamp: new Date(),
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: this.newMessage,
      timestamp: new Date(),
    };

    this.messages.push(userMessage);
    this.isLoading = true;
    this.newMessage = '';

    const messageHistory = this.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    this.openaiService.getChatCompletion(messageHistory).subscribe({
      next: (response) => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.body || '',
          timestamp: new Date(),
        };

        this.messages.push(assistantMessage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting chat completion', err);
        this.isLoading = false;
      },
    });
  }

  getFormattedTimestamp(index: number): string {
    const message = this.messages[index];
    if (!message || !message.timestamp) return '';

    const now = new Date();
    const timestamp = message.timestamp;
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  autoResizeTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
