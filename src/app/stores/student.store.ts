import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User.model';

export interface StudentState {
    students: User[];
}

export interface Loaded {
    isLoading: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class StudentStore {
    private _state: BehaviorSubject<StudentState> = new BehaviorSubject<StudentState>({
        students: []
    });

    private _load: BehaviorSubject<Loaded> = new BehaviorSubject<Loaded>({
        isLoading: false
    })

    constructor() { }

    getStudents(): Observable<User[]> {
        return this._state.asObservable().pipe(map(state => state.students));
    }

    async setStudents(students: User[]): Promise<void> {
        this._state.next({ ...this._state.value, students });
    }

    getLoading(): Observable<boolean> {
        return this._load.asObservable().pipe(map(state => state.isLoading));
    }

    setLoading(isLoading: boolean): void {
        this._load.next({ ...this._load.value, isLoading });
    }
}
