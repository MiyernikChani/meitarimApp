import { Component } from '@angular/core';
import { Student } from '../../services/student';
import { User } from '../../models/User.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manag-student',
  standalone: true,
  imports: [
    IconField,
    InputIcon,
    Tag,
    CommonModule,
    HttpClientModule,
    TableModule,
    InputTextModule,
    SelectButtonModule,
    ButtonModule,
    ToastModule,
    FormsModule
  ],
  templateUrl: './manag-student.html',
  styleUrls: ['./manag-student.scss'],
  providers: [Student, MessageService]
})
export class ManagStudent {
  students: User[] = [];
  selectedStudents!: User;
  editingStudent?: User;

  // ✏️ עריכה
  editingIdentityNumber = '';
  editingName = '';
  editingPoints = 0;
  editingClasss = '';
  editingRole = '';

  // ➕ הוספה
  showAddForm = false;
  newStudent: any = { id: 0, identityNumber: '', name: '', points: 0, classs: '', role: '', isValidDate: false };

  classOptions = [
    { label: 'ט1', value: 'ט1' },
    { label: 'ט2', value: 'ט2' },
    { label: 'י1', value: 'י1' },
    { label: 'י2', value: 'י2' },
    { label: 'יא1', value: 'יא1' },
    { label: 'יא2', value: 'יא2' },
    { label: 'יא3', value: 'יא3' },
    { label: 'יב1', value: 'יב1' },
    { label: 'יב2', value: 'יב2' },
    { label: 'יב3', value: 'יב3' }
  ];

  roleOptions = [
    { label: 'תלמידה', value: 'student' },
    { label: 'כיתה', value: 'teacher' },
  ];

  constructor(
    private StudentService: Student,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.StudentService.fetchStudents().subscribe(students => {
      this.students = students.map(s => ({
        ...s,
        roleLabel: this.getRoleLabel(s.role)
      }));
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'teacher': return 'כיתה';
      case 'student': return 'תלמידה';
      case 'manager': return 'מנהל';
      default: return role;
    }
  }

  getSeverity(role: string): 'success' | 'info' | 'warn' | 'secondary' {
    switch (role) {
      case 'teacher': return 'warn';
      case 'student': return 'info';
      case 'manager': return 'success';
      default: return 'secondary';
    }
  }

  getGlobalFilterValue(dt: any): string {
    const global = dt.filters['global'];
    if (!global) return '';
    if (Array.isArray(global)) return global[0]?.value || '';
    return global.value || '';
  }

  exportToExcel(dt: Table) {
    const dataToExport = dt.filteredValue ?? this.students;

    const worksheetData: Record<string, any>[] = dataToExport.map(s => ({
      'מספר זהות': s.identityNumber,
      'שם': s.name,
      'נקודות': s.points,
      'כיתה': s.classs,
      'סטטוס': s.roleLabel
    }));

    // סדר עמודות (לכאורה RTL)
    const colOrder = ['סטטוס', 'כיתה', 'נקודות', 'שם', 'מספר זהות'];

    const reordered: any[][] = [];
    reordered.push(colOrder);

    worksheetData.forEach(row => {
      reordered.push(colOrder.map(col => row[col]));
    });

    const ws = XLSX.utils.aoa_to_sheet(reordered);

    ws['!cols'] = [
      { wpx: 120 },
      { wpx: 100 },
      { wpx: 80 },
      { wpx: 150 },
      { wpx: 120 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'students.xlsx');
    
  }


  // ✏️ התחלת עריכה 
  startEdit(student: User) {
    this.editingStudent = { ...student };

    this.editingIdentityNumber = student.identityNumber;
    this.editingName = student.name;
    this.editingPoints = student.points;

    // ⭐⭐⭐ תיקון: טוען ערכים מקוריים ל-select
    this.editingClasss = student.classs;
    this.editingRole = student.role;
  }

  saveEdit() {
    if (!this.editingStudent) return;

    // BASIC FIELDS
    this.editingStudent.identityNumber = this.editingIdentityNumber;
    this.editingStudent.name = this.editingName;
    this.editingStudent.points = this.editingPoints;

    // ⭐⭐⭐ תיקון חשוב: אם המשתמשת לא שינתה — נשאר הערך המקורי
    this.editingStudent.classs = this.editingClasss || this.editingStudent.classs;
    this.editingStudent.role = this.editingRole || this.editingStudent.role;

    const s = this.editingStudent;

    this.StudentService.updateStudent(this.editingStudent).subscribe({
      next: () => {
        this.editingStudent = undefined;
        this.fetchStudents();

        if (s.role === 'student') {
          this.showSuccess('התלמידה עודכנה בהצלחה');
        } else {
          this.showSuccess('כתה עודכנה בהצלחה');
        }
      },
      error: (err) => {
        if (s.role === 'student') {
          this.showError('שגיאה בעדכון תלמידה');
        } else {
          if (err.status == 409) {
            this.showError("אין אפשרות להכניס כתה פעם נוספת");
          } else {
            this.showError('שגיאה בעדכון כתה');
          }
        }
      }
    });
  }

  cancelEdit() {
    this.editingStudent = undefined;
  }

  increasePoints() { this.editingPoints++; }
  decreasePoints() { if (this.editingPoints > 0) this.editingPoints--; }

  // ➕ הוספת תלמידה
  addStudent() {
    if (this.newStudent.identityNumber.length !== 9 || this.newStudent.name.length < 3 || !this.newStudent.role) {
      this.showError('יש למלא את כל השדות כנדרש');
      return;
    }

    this.StudentService.addStudent(this.newStudent).subscribe({
      next: () => {
        if (this.newStudent.role === 'student') {
          this.showSuccess('התלמידה נוספה בהצלחה');
        } else {
          this.showSuccess('כתה נוספה בהצלחה');
        }
        this.showAddForm = false;

        this.newStudent = { identityNumber: '', name: '', points: 0, classs: '', role: '' };
        this.fetchStudents();
      },
      error: (err) => this.showError(err.error)
    });
  }

  cancelAdd() {
    this.showAddForm = false;
  }

  deleteStudent(student: User) {
    this.StudentService.deleteStudent(student.identityNumber).subscribe({
      next: () => {
        if (student.role === 'student') {
          this.showSuccess(`התלמידה ${student.name} נמחקה בהצלחה`);
        } else {
          this.showSuccess(`הכתה ${student.name} נמחקה בהצלחה`);
        }
        this.fetchStudents();
      },
      error: () => this.showError('שגיאה במחיקה')
    });
  }

  showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: msg });
  }

  showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: msg });
  }
}
