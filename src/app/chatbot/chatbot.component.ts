import { Component } from '@angular/core';
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
export class ChatbotComponent {
  message = '';
  chatLog: { from: 'user' | 'bot', text: string }[] = [];

  constructor(private http: HttpClient) {}

  sendMessage() {
    const userMsg = this.message.trim();
    if (!userMsg) return;

    this.chatLog.push({ from: 'user', text: userMsg });

    this.http.get<any>('http://127.0.0.1:8000/chat', { params: { message: userMsg } }).subscribe(
      (res) => {
        this.chatLog.push({ from: 'bot', text: res.response });
        this.message = '';
      },
      () => {
        this.chatLog.push({ from: 'bot', text: 'Error: Could not reach server.' });
        this.message = '';
      }
    );
  }
}
