import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent],
  template: `
    <main>
      <app-chat></app-chat>
    </main>
  `,
  styles: [
    `
      main {
        height: 100vh;
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class AppComponent {
  title = 'angular';
}
