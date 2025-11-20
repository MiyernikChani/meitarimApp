import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagerStore } from '../stores/manager.store';
import { Time } from '../models/Manager.model';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../consts/apiUrls.config';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Manager {
  private readonly ApiUrls = apiUrls;
  constructor(private managerStore: ManagerStore, private httpClient: HttpClient) { }

  getTime(): Observable<Time | null> {
    return this.managerStore.getTime();
  }

  setTime(time: Time | null): void {
    this.managerStore.setTime(time);
  }

  getLoading(): Observable<boolean> {
    return this.managerStore.getLoading();
  }

  setLoading(load: boolean): void {
    this.managerStore.setLoading(load);
  }

  getTimeAccumulation(): Observable<Time | null> {
    this.managerStore.setLoading(true);
    return this.httpClient.get<Time>(this.ApiUrls.base + this.ApiUrls.getTimeAccumulation).pipe(
      tap((res: Time) => {
        this.managerStore.setTime(res);
        this.managerStore.setLoading(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error fetching time:', err);
        this.managerStore.setTime(null);
        this.managerStore.setLoading(false);
        return of(null);
      })
    );
  }

  getAccumulationAmmount(): Observable<number | null> {
    this.managerStore.setLoading(true);
    return this.httpClient.get<number>(this.ApiUrls.base + this.ApiUrls.getAccumulationAmmount).pipe(
      tap((res: number) => {
        this.managerStore.setAccumulationAmount(res);
        this.managerStore.setLoading(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error fetching accumulation amount:', err);
        this.managerStore.setAccumulationAmount(null);
        this.managerStore.setLoading(false);
        return of(null);
      })
    );
  }

  getSystemStatus(): Observable<boolean | null> {
    this.managerStore.setLoading(true);
    return this.httpClient.get<boolean>(this.ApiUrls.base + this.ApiUrls.getSystemStatus).pipe(
      tap((res: boolean) => {
        this.managerStore.setSystemStatus(res);
        this.managerStore.setLoading(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error fetching system status:', err);
        this.managerStore.setSystemStatus(null);
        this.managerStore.setLoading(false);
        return of(null);
      })
    );
  }


  updateTime(time: Time): Observable<void> {
    const params = {
      open: time.timeOpenAccumulation,
      close: time.timeCloseAccumulation
    };
    return this.httpClient.put<void>(
      this.ApiUrls.base + this.ApiUrls.putTimeAccumulation,
      {},
      { params }
    );
  }

  updateAccumulationAmount(amount: number): Observable<void> {
    const params = { ammount: amount.toString() };
    return this.httpClient.put<void>(
      this.ApiUrls.base + this.ApiUrls.putAccumulationAmount,
      {}, // גוף ריק
      { params }
    );
  }


  updateSystemStatus(status: boolean): Observable<void> {
    const params = { status: status.toString() };
    return this.httpClient.put<void>(
      this.ApiUrls.base + this.ApiUrls.putSystemStatus,
      {},
      { params }
    );
  }
}
