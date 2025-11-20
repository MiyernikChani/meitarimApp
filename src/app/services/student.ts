import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { StudentStore } from '../stores/student.store';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../consts/apiUrls.config';
import { catchError, Observable, tap, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Student {
  private readonly ApiUrls = apiUrls;
  constructor(private studentStore: StudentStore, private httpClient: HttpClient) { }

  getStudents(): Observable<User[]> {
    return this.studentStore.getStudents();
  }

  setStudents(students: User[]): void {
    this.studentStore.setStudents(students);
  }

  getLoading(): Observable<boolean> {
    return this.studentStore.getLoading();
  }

  setLoading(load: boolean): void {
    this.studentStore.setLoading(load);
  }

  fetchStudents(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.ApiUrls.base + this.ApiUrls.getStudents).pipe(
      map(res => {
        // console.log('Mapping response:', res);
        return res;
      }),
      tap(students => {
        this.studentStore.setStudents(students);
        this.studentStore.setLoading(false);
      }),
      catchError(error => {
        this.studentStore.setLoading(false);
        // console.error('Error fetching students:', error);
        return throwError(() => error);
      })
    );
  }

  deleteStudent(studentId: string): Observable<string> {
    return this.httpClient.delete(
      this.ApiUrls.base + this.ApiUrls.deleteStudent + studentId,
      { responseType: 'text' }
    ).pipe(
      tap(response => {
        console.log('תגובת השרת:', response);

        // שליפת הרשימה הנוכחית ישירות מתוך ה־BehaviorSubject
        const currentStudents = this.studentStore['_state'].value.students;
        const filtered = currentStudents.filter(s => s.identityNumber != studentId);
        this.studentStore.setStudents(filtered);
      })
    );
  }

  updateStudent(student: User): Observable<string> {
    return this.httpClient.put(
      `${this.ApiUrls.base}${this.ApiUrls.updateStudent}`,
      student,                       // גוף הבקשה
      { responseType: 'text' }        // מחזיר טקסט
    ).pipe(
      tap(response => {
        console.log('תגובת השרת:', response);

        // עדכון הרשימה ב-BehaviorSubject
        const currentStudents = this.studentStore['_state'].value.students;
        const updatedStudents = currentStudents.map(s =>
          s.identityNumber === student.identityNumber ? { ...student } : s
        );
        this.studentStore.setStudents(updatedStudents);
      })
    );
  }

  addStudent(student: User): Observable<string> {
    return this.httpClient.post(
      `${this.ApiUrls.base}${this.ApiUrls.addStudent}?role=${student.role}`,
      student,
      { responseType: 'text' }
    ).pipe(
      tap(response => {
        console.log('תגובת השרת:', response);
        const currentStudents = this.studentStore['_state'].value.students;
        const updatedStudents = currentStudents.map(s =>
          s.identityNumber === student.identityNumber
            ? { ...student, role: student.role }
            : s
        );
        this.studentStore.setStudents(updatedStudents);
      })
    );
  }
}
