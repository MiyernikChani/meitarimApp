// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth-service';
// import { User } from '../../models/User.model';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { MessageService } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';
// import { FormsModule } from '@angular/forms';
// import { Manager } from '../../services/manager';
// import { Time } from '../../models/Manager.model';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-manager-component',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, ToastModule, FormsModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './managerComponent.html',
//   styleUrls: ['./managerComponent.scss'],
//   providers: [AuthService, MessageService, Manager]
// })

// export class ManagerComponent {
//   constructor(private authService: AuthService, private messageService: MessageService, private managerService: Manager,
//     private timeFrm: FormBuilder, private router: Router, private route: ActivatedRoute
//   ) { }

//   user: User | null = null;
//   time: Time | null = null;
//   accumulationAmount: number | null = null;
//   systemStatus: boolean | null = null;

//   timeForm!: FormGroup;
//   isEditing = false;

//   pointsForm!: FormGroup;
//   isEditingPoints = false;

//   ngOnInit() {
//     this.fetchStudentData();
//     this.fetchTimeAccumulation();
//     this.fetchAccumulationAmount();
//     this.fetchSystemStatus();
//     this.timePicker();
//   }

//   fetchStudentData() {
//     this.authService.getAuth().subscribe({
//       next: (data) => {
//         this.user = data?.user || null;
//         console.log('Fetched manager data:', this.user);
//         this.showWelcomeMessage();
//       },
//       error: (error) => {
//         console.log('Error fetching manager data:', error);
//       }
//     });
//   }

//   fetchTimeAccumulation() {
//     this.managerService.getTimeAccumulation().subscribe({
//       next: (data: Time | null) => {
//         // console.log('Fetched time accumulation data:', data);
//         this.time = data || null;
//       },
//       error: (error) => {
//         console.log('Error fetching time accumulation data:', error);
//       }
//     });
//   }

//   fetchAccumulationAmount() {
//     this.managerService.getAccumulationAmmount().subscribe({
//       next: (data: number | null) => {
//         // console.log('Fetched accumulation amount data:', data);
//         this.accumulationAmount = data || null;
//       },
//       error: (error) => {
//         console.log('Error fetching accumulation amount data:', error);
//       }
//     });
//   }

//   fetchSystemStatus() {
//     this.managerService.getSystemStatus().subscribe({
//       next: (data: boolean | null) => {
//         // console.log('Fetched system status data:', data);
//         this.systemStatus = data || null;
//       },
//       error: (error) => {
//         console.log('Error fetching system status data:', error);
//       }
//     });
//   }

//   showWelcomeMessage() {
//     this.messageService.add({
//       severity: 'success',
//       summary: 'ברוכה הבאה!',
//       detail: 'שלום למנהלת ' + (this.user?.name ? this.user.name : '!')
//     });
//   }

//   initForm() {
//     this.timeForm = this.timeFrm.group({
//       timeOpenAccumulation: [
//         this.time?.timeOpenAccumulation || '',
//         [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]
//       ],
//       timeCloseAccumulation: [
//         this.time?.timeCloseAccumulation || '',
//         [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]
//       ]
//     });
//   }

//   toggleEdit() {
//     this.isEditing = !this.isEditing;
//     if (this.isEditing) {
//       this.initForm();
//     }
//   }

//   saveTime() {
//     if (this.timeForm.invalid) {
//       this.timeForm.markAllAsTouched();
//       return;
//     }
//     const updatedTime: Time = this.timeForm.value;
//     console.log('tttttttttt', updatedTime);

//     this.managerService.updateTime(updatedTime).subscribe({
//       next: (res) => {
//         console.log('Time updated successfully:', res);
//         this.time = updatedTime;
//         this.isEditing = false;
//         this.messageService.add({
//           severity: 'success',
//           summary: 'נשמר בהצלחה',
//           detail: 'זמני צבירת נקודות התעדכנו בהצלחה!'
//         });
//       },
//       error: (error) => {
//         console.error('Error updating time:', error);
//         if (error.status === 200) {
//           this.time = updatedTime;
//           this.isEditing = false;
//           this.messageService.add({
//             severity: 'success',
//             summary: 'נשמר בהצלחה',
//             detail: 'זמני צבירת נקודות התעדכנו בהצלחה!'
//           });
//         }
//         else {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'שגיאה',
//             detail: 'אירעה שגיאה בעת השמירה'
//           });
//         }
//       }
//     });
//   }

//   initPointsForm() {
//     this.pointsForm = this.timeFrm.group({
//       accumulationAmount: [
//         this.accumulationAmount || '',
//         [Validators.required, Validators.min(1)]
//       ]
//     });
//   }

//   // פתיחה/סגירה של טופס העריכה
//   toggleEditPoints() {
//     this.isEditingPoints = !this.isEditingPoints;
//     if (this.isEditingPoints) {
//       this.initPointsForm();
//     }
//   }

//   // שמירת כמות נקודות
//   savePoints() {
//     if (this.pointsForm.invalid) {
//       this.pointsForm.markAllAsTouched();
//       return;
//     }

//     const newAmount = this.pointsForm.value.accumulationAmount;
//     console.log('Saving new accumulation amount:', newAmount);

//     this.managerService.updateAccumulationAmount(newAmount).subscribe({
//       next: (res) => {
//         console.log('Accumulation amount updated successfully:', res);
//         this.accumulationAmount = newAmount;
//         this.isEditingPoints = false;
//         this.messageService.add({
//           severity: 'success',
//           summary: 'נשמר בהצלחה',
//           detail: 'כמות צבירת הנקודות עודכנה בהצלחה!'
//         });
//       },
//       error: (error) => {
//         console.error('Error updating accumulation amount:', error);
//         if (error.status === 200) {
//           this.accumulationAmount = newAmount;
//           this.isEditingPoints = false;
//           this.messageService.add({
//             severity: 'success',
//             summary: 'נשמר בהצלחה',
//             detail: 'כמות צבירת הנקודות עודכנה בהצלחה!'
//           });
//         } else {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'שגיאה',
//             detail: 'אירעה שגיאה בעת עדכון כמות הנקודות'
//           });
//         }
//       }
//     });
//   }

//   // לחיצה על הכפתור
//   toggleSystemStatus() {
//     const newStatus = !this.systemStatus;
//     this.managerService.updateSystemStatus(newStatus).subscribe({
//       next: () => {
//         this.systemStatus = newStatus;
//         this.messageService.add({
//           severity: 'success',
//           summary: 'הצלחה',
//           detail: newStatus ? 'המערכת נסגרה בהצלחה' : 'המערכת נפתחה בהצלחה'
//         });
//       },
//       error: (err) => {
//         if (err.status === 200) {
//           this.systemStatus = newStatus;
//           this.messageService.add({
//             severity: 'success',
//             summary: 'הצלחה',
//             detail: newStatus ? 'המערכת נפתחה בהצלחה' : 'המערכת נסגרה בהצלחה'
//           });
//         }
//         else {
//           console.error('Error updating system status:', err);
//           this.messageService.add({
//             severity: 'error',
//             summary: 'שגיאה',
//             detail: 'אירעה שגיאה בעדכון סטטוס המערכת'
//           });
//         }
//       }
//     });
//   }

//   manageStudent() {
//     this.router.navigate(['/manage-student'])
//   }

//   // רשימת שעות
//   timeOptions: string[] = [];
//   dropdownOpen: 'open' | 'close' | null = null;

//   timePicker() {
//     this.timeOptions = [];
//     for (let h = 0; h < 24; h++) {
//       ['00', '30'].forEach(m => {
//         const hour = h < 10 ? '0' + h : h;
//         this.timeOptions.push(`${hour}:${m}`);
//       });
//     }
//   }

//   toggleDropdown(field: 'open' | 'close') {
//     this.dropdownOpen = this.dropdownOpen === field ? null : field;
//   }

//   selectTime(controlName: string, value: string) {
//     this.timeForm.get(controlName)?.setValue(value);
//     this.dropdownOpen = null;
//   }

//   // סגירה בלחיצה מחוץ לאזור
//   ngAfterViewInit() {
//     document.addEventListener('click', () => {
//       this.dropdownOpen = null;
//     });
//   }
// }


















import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { User } from '../../models/User.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Manager } from '../../services/manager';
import { Time } from '../../models/Manager.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-manager-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ToastModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './managerComponent.html',
  styleUrls: ['./managerComponent.scss'],
  providers: [AuthService, Manager]
})
export class ManagerComponent implements OnInit, AfterViewInit {

  // טפסים
  timeForm!: FormGroup;
  pointsForm!: FormGroup;

  // מצבי עריכה
  isEditingTime = false;
  isEditingPoints = false;

  // נתונים מהשרת
  user: User | null = null;
  time: Time | null = null;
  accumulationAmount: number | null = null;
  systemStatus: boolean | null = null;

  // שעות לטיימפיקר
  timeOptions: string[] = [];
  dropdownOpen: 'open' | 'close' | null = null;

  private userFetched = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private managerService: Manager,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.fetchStudentData();
    this.fetchTimeAccumulation();
    this.fetchAccumulationAmount();
    this.fetchSystemStatus();
    this.initTimeOptions();
  }

  ngAfterViewInit(): void {
    // סגירת Dropdown בלחיצה מחוץ
    document.addEventListener('click', () => {
      this.dropdownOpen = null;
    });
  }

  // ========== INIT FORMS ==========
  initForms(): void {
    this.timeForm = this.fb.group({
      timeOpenAccumulation: ['', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]],
      timeCloseAccumulation: ['', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]]
    });

    this.pointsForm = this.fb.group({
      accumulationAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // ========== FETCH DATA ==========
  fetchStudentData(): void {
    this.authService.getAuth().pipe(take(1)).subscribe({
      next: (data) => {
        this.user = data?.user || null;
        console.log('Fetched manager data:', this.user);
        this.showWelcomeMessage(this.user?.name || "");
      },
      error: (err) => console.error('Error fetching manager data:', err)
    });
  }

  fetchTimeAccumulation(): void {
    this.managerService.getTimeAccumulation().subscribe({
      next: (data: Time | null) => {
        console.log('Fetched time accumulation data:', data);
        this.time = data || null;
        if (this.time) {
          this.timeForm.patchValue({
            timeOpenAccumulation: this.time.timeOpenAccumulation,
            timeCloseAccumulation: this.time.timeCloseAccumulation
          });
        }
      },
      error: (err) => console.error('Error fetching time accumulation data:', err)
    });
  }

  fetchAccumulationAmount(): void {
    this.managerService.getAccumulationAmmount().subscribe({
      next: (data: number | null) => {
        console.log('Fetched accumulation amount data:', data);
        this.accumulationAmount = data || null;
        if (this.accumulationAmount !== null) {
          this.pointsForm.patchValue({ accumulationAmount: this.accumulationAmount });
        }
      },
      error: (err) => console.error('Error fetching accumulation amount data:', err)
    });
  }

  fetchSystemStatus(): void {
    this.managerService.getSystemStatus().subscribe({
      next: (data: boolean | null) => {
        console.log('Fetched system status data:', data);
        this.systemStatus = data ?? null;
      },
      error: (err) => console.error('Error fetching system status:', err)
    });
  }

  // ========== EDIT TOGGLES ==========
  toggleEditTime(): void {
    console.log('Toggling time edit. Current state:', this.isEditingTime);
    this.isEditingTime = !this.isEditingTime;
  }

  toggleEditPoints(): void {
    console.log('Toggling points edit. Current state:', this.isEditingPoints);
    this.isEditingPoints = !this.isEditingPoints;
  }

  // ========== SAVE ==========
  saveTime(): void {
    if (this.timeForm.invalid) {
      this.timeForm.markAllAsTouched();
      console.warn('Time form invalid:', this.timeForm.value);
      return;
    }
    const updatedTime: Time = this.timeForm.value;
    console.log('Saving time:', updatedTime);

    this.managerService.updateTime(updatedTime).subscribe({
      next: (res) => {
        console.log('Time updated successfully:', res);
        this.time = updatedTime;
        this.isEditingTime = false;
        this.messageService.add({
          severity: 'success',
          summary: 'נשמר בהצלחה',
          detail: 'זמני צבירת נקודות התעדכנו בהצלחה!'
        });
      },
      error: (err) => {
        console.error('Error updating time:', err);
        if (err.status === 200) {
          console.log('HTTP returned 200 despite error object. Accepting update.');
          this.time = updatedTime;
          this.isEditingTime = false;
          this.messageService.add({
            severity: 'success',
            summary: 'נשמר בהצלחה',
            detail: 'זמני צבירת נקודות התעדכנו בהצלחה!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'שגיאה',
            detail: 'אירעה שגיאה בעת השמירה'
          });
        }
      }
    });
  }

  savePoints(): void {
    if (this.pointsForm.invalid) {
      this.pointsForm.markAllAsTouched();
      console.warn('Points form invalid:', this.pointsForm.value);
      return;
    }

    const newAmount = this.pointsForm.value.accumulationAmount;
    console.log('Saving new accumulation amount:', newAmount);

    this.managerService.updateAccumulationAmount(newAmount).subscribe({
      next: (res) => {
        console.log('Accumulation amount updated successfully:', res);
        this.accumulationAmount = newAmount;
        this.isEditingPoints = false;
        this.messageService.add({
          severity: 'success',
          summary: 'נשמר בהצלחה',
          detail: 'כמות צבירת הנקודות עודכנה בהצלחה!'
        });
      },
      error: (err) => {
        console.error('Error updating accumulation amount:', err);
        if (err.status === 200) {
          console.log('HTTP returned 200 despite error object. Accepting update.');
          this.accumulationAmount = newAmount;
          this.isEditingPoints = false;
          this.messageService.add({
            severity: 'success',
            summary: 'נשמר בהצלחה',
            detail: 'כמות צבירת הנקודות עודכנה בהצלחה!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'שגיאה',
            detail: 'אירעה שגיאה בעת עדכון כמות הנקודות'
          });
        }
      }
    });
  }

  toggleSystemStatus(): void {
    const newStatus = !this.systemStatus;
    console.log('Toggling system status. New status:', newStatus);
    this.managerService.updateSystemStatus(newStatus).subscribe({
      next: () => {
        console.log('System status updated successfully.');
        this.systemStatus = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'הצלחה',
          detail: newStatus ? 'המערכת נפתחה בהצלחה' : 'המערכת נסגרה בהצלחה'
        });
      },
      error: (err) => {
        console.error('Error updating system status:', err);
        if (err.status === 200) {
          console.log('HTTP returned 200 despite error object. Accepting status update.');
          this.systemStatus = newStatus;
          this.messageService.add({
            severity: 'success',
            summary: 'הצלחה',
            detail: newStatus ? 'המערכת נפתחה בהצלחה' : 'המערכת נסגרה בהצלחה'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'שגיאה',
            detail: 'אירעה שגיאה בעדכון סטטוס המערכת'
          });
        }
      }
    });
  }

  manageStudent(): void {
    console.log('Navigating to manage-student page');
    this.router.navigate(['/manage-student']);
  }

  // ========== TIME PICKER ==========
  initTimeOptions(): void {
    this.timeOptions = [];
    for (let h = 0; h < 24; h++) {
      ['00', '30'].forEach(m => {
        const hour = h < 10 ? '0' + h : h;
        this.timeOptions.push(`${hour}:${m}`);
      });
    }
    console.log('Initialized time options:', this.timeOptions);
  }

  toggleDropdown(field: 'open' | 'close'): void {
    console.log('Toggling dropdown:', field, 'Current state:', this.dropdownOpen);
    this.dropdownOpen = this.dropdownOpen === field ? null : field;
  }

  selectTime(controlName: string, value: string): void {
    console.log('Selected time for', controlName, ':', value);
    this.timeForm.get(controlName)?.setValue(value);
    this.dropdownOpen = null;
  }

  // ========== WELCOME MESSAGE ==========
  showWelcomeMessage(name: string): void {
    if (this.user?.name) {
      console.log('Showing welcome message for:', this.user.name);
      this.messageService.add({
        severity: 'success',
        summary: 'ברוכה הבאה!',
        detail: `שלום למנהלת ${name}`
      });
    }
  }
}
