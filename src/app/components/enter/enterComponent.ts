import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter-component',
  standalone: true,
  templateUrl: './enterComponent.html',
  styleUrls: ['./enterComponent.scss'],
  imports: [FormsModule, HttpClientModule, ToastModule, CommonModule],
  providers: [AuthService, MessageService]
})
export class EnterComponent implements AfterViewInit {

  @ViewChild('idInput') idInput!: ElementRef<HTMLInputElement>;

  code: string = '';

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

  ngAfterViewInit() {
    this.idInput.nativeElement.focus();
  }
  onCodeEvent(event?: KeyboardEvent) {
    // ניקוי תווים שאינם ספרות
    this.code = this.code.replace(/\D/g, '');

    // ⛔ אם לחצו Enter לפני שיש 9 ספרות — לחסום
    if (event?.key === 'Enter' && this.code.length < 9) {
      event.preventDefault();
      return;
    }

    // ✔ אם יש 9 ספרות — להיכנס (כרטיס או Enter ידני)
    if (this.code.length === 9) {
      localStorage.setItem('id', this.code);

      // אם זה Enter — למנוע ריענון
      if (event?.key === 'Enter') {
        event.preventDefault();
      }

      this.login();
    }
  }

  login() {
    this.authService.login().subscribe({
      next: (response) => {
        if (typeof response === 'string') {
          this.showError(response);
          console.log('שגיאת שרת:');
        } else {
          this.showSuccess("ברוכה הבאה!");

          this.authService.getAuth().subscribe(auth => {
            if (auth) {
              if (auth.user?.role === "student") {
                this.router.navigate(['/enter-student']);
              }
              else {
                this.router.navigate(['/manager']);
              }
            }
          });
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.showError("שגיאת שרת");
      }
    });
  }



  onSubmit() {
    this.login();
  }

  showSuccess(res: string) {
    this.messageService.add({ severity: 'success', summary: 'ברוכה הבאה!', detail: res });
  }

  showError(res: string) {
    this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: res });
  }
}
