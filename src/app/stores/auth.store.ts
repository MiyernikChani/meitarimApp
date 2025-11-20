import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { map } from 'rxjs/operators';
import { Auth } from '../models/Auth.model';

export interface AuthState {
    auth: Auth | null;
    points: number | null;
}

export interface Loaded {
    isLoading: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class AuthStore {
    private _state: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>({
        auth: null,
        points: null
    });

    private _load: BehaviorSubject<Loaded> = new BehaviorSubject<Loaded>({
        isLoading: false
    })

    constructor() { }

    getAuth(): Observable<Auth | null> {
        return this._state.asObservable().pipe(map(state => state.auth));
    }

    async setAuth(auth: Auth | null): Promise<void> {
        // console.log('store: Setting auth:', auth);
        this._state.next({ ...this._state.value, auth });
    }

    getLoading(): Observable<boolean> {
        return this._load.asObservable().pipe(map(state => state.isLoading));
    }

    setLoading(isLoading: boolean): void {
        this._load.next({ ...this._load.value, isLoading });
    }

    getUser(): Observable<User | null> {
        return this._state.asObservable().pipe(map(state => state.auth ? state.auth.user : null));
    }

    getToken(): Observable<string | null> {
        return this._state.asObservable().pipe(map(state => state.auth ? state.auth.token : null));
    }

    logOut(): void {
        this._state.next({ ...this._state.value, auth: null });
    }

    setClassPoints(points: number): void {
        this._state.next({ ...this._state.value, points });

    }
    getClassPoints(): Observable<number | null> {
        return this._state.asObservable().pipe(map(state => state.points));
    }
}
