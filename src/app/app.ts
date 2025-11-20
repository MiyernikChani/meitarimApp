import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ToastModule],
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-left"></p-toast>
  `,
  styleUrls: ['./app.scss'],
  providers: [MessageService]

})
export class App {

}

