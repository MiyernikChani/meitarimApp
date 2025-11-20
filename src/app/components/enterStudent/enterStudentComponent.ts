import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { User } from '../../models/User.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs';

@Component({
  selector: 'app-enter-student-component',
  standalone: true,
  templateUrl: './enterStudentComponent.html',
  styleUrls: ['./enterStudentComponent.scss'],
  providers: [AuthService, CommonModule, HttpClientModule],
  imports: [CommonModule, HttpClientModule, Dialog, ButtonModule]
})
export class EnterStudentComponent implements OnInit, OnDestroy {

  user: User | null = null;
  message: string = '';
  name: string = '';
  clsPnts: number = 0;

  visible1: boolean = false;
  visible2: boolean = false;

  private logoutTimerId: any;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.fetchStudentData();
    this.logoutTimerId = setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/']);

    }, 30_000);
  }

  ngOnDestroy() {
    // נקה את הטיימר כדי למנוע memory leaks
    if (this.logoutTimerId) {
      clearTimeout(this.logoutTimerId);
    }

    // נקה כל subscription פתוח
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchStudentData() {
    if (this.user){
      return;
    }
    else{
      this.authService.login().subscribe()
    }
    const sub = this.authService.getAuth().pipe(take(1)).subscribe({
      next: (data) => {
        this.user = data?.user || null;
        this.message = data?.message || '';
        console.log('Fetched student data:', this.user, this.message);
        this.showMessage();
      }
    });
    this.subscriptions.push(sub);
  }


  showMessage() {
    if (this.user?.role == 'teacher') {
      this.name = "שלום למורה " + this.user?.name + " היקרה!"
    }
    else if (this.message == 'V') {
      this.name = "שלום לתלמידה " + this.user?.name + " היקרה!"
      this.message = "";
    }
    else if (this.message == 'X') {
      this.name = "בוקר טוב לתלמידה " + this.user?.name + " היקרה!"
      this.message = "חבל, הגעת מאוחר!";
    }
    else {
      this.name = "בוקר טוב לתלמידה " + this.user?.name + " היקרה!"
      this.message = this.message;
    }
  }

  messageType(): 'success' | 'warning' | 'error' | '' {
    if (!this.message) return '';
    if (this.message.includes('חבל') || this.message.includes('לא ניתן')) return 'error';
    if (this.message.includes('בוקר טוב')) return 'warning';
    if (this.message.includes('צברת')) return 'success';
    return '';
  }

  showDialog1() {
    this.visible1 = true;
  }

  classPoints() {
    const sub = this.authService.getClassPoints().subscribe({
      next: (data) => {
        console.log('Fetched class points:', data);
        this.clsPnts = data || 0;
        this.visible2 = true;
      }
    });
    this.subscriptions.push(sub);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
