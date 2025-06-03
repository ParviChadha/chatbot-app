import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef;
  
  message = '';
  chatLog: { from: 'user' | 'bot', text: string }[] = [];
  isChatOpen = false;
  isTyping = false;

  constructor(private http: HttpClient) {
    // Add welcome message when component initializes
    this.chatLog.push({ 
      from: 'bot', 
      text: 'Hello! I\'m here to help you with any questions about International Logic Systems. How can I assist you today?' 
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    console.log('Chat opened:', this.isChatOpen); // Add this debug line
  }

  sendMessage() {
    const userMsg = this.message.trim();
    if (!userMsg || this.isTyping) return;

    // Add user message to chat
    this.chatLog.push({ from: 'user', text: userMsg });
    
    // Clear input and show typing indicator
    this.message = '';
    this.isTyping = true;

    // Simulate a slight delay for more natural feel
    setTimeout(() => {
      this.http.get<any>('http://127.0.0.1:8000/chat', { 
        params: { message: userMsg } 
      }).subscribe({
        next: (res) => {
          this.chatLog.push({ from: 'bot', text: res.response });
          this.isTyping = false;
        },
        error: (error) => {
          console.error('Chat error:', error);
          this.chatLog.push({ 
            from: 'bot', 
            text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.' 
          });
          this.isTyping = false;
        }
      });
    }, 500); // 500ms delay for typing effect
  }

  private scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}