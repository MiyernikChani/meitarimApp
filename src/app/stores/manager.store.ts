import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Time } from '../models/Manager.model';

export interface ManagerState {
    time: Time | null;
    accumulationAmount: number | null;
    systemStatus: boolean | null;
}

export interface Loaded {
    isLoading: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class ManagerStore {
    private _state: BehaviorSubject<ManagerState> = new BehaviorSubject<ManagerState>({
        time: null,
        accumulationAmount: null,
        systemStatus: null
    });

    private _load: BehaviorSubject<Loaded> = new BehaviorSubject<Loaded>({
        isLoading: false
    })

    constructor() { }

    getTime(): Observable<Time | null> {
        return this._state.asObservable().pipe(map(state => state.time));
    }

    async setTime(time: Time | null): Promise<void> {
        this._state.next({ ...this._state.value, time });
    }

    getAccumulationAmount(): Observable<number | null> {
        return this._state.asObservable().pipe(map(state => state.accumulationAmount));
    }

    async setAccumulationAmount(amount: number | null): Promise<void> {
        this._state.next({ ...this._state.value, accumulationAmount: amount });
    }

    getSystemStatus(): Observable<boolean | null> {
        return this._state.asObservable().pipe(map(state => state.systemStatus));
    }

    async setSystemStatus(status: boolean | null): Promise<void> {
        this._state.next({ ...this._state.value, systemStatus: status });
    }

    getLoading(): Observable<boolean> {
        return this._load.asObservable().pipe(map(state => state.isLoading));
    }

    setLoading(isLoading: boolean): void {
        this._load.next({ ...this._load.value, isLoading });
    }
}
