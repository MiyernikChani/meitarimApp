import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { AuthStore } from '../stores/auth.store';
import { User } from '../models/User.model';
import { apiUrls } from '../consts/apiUrls.config';
import { Auth } from '../models/Auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private _role$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private readonly ApiUrls = apiUrls;

  constructor(private httpClient: HttpClient, private authStore: AuthStore) {
    this.authStore.getToken().subscribe(token => {
      this._token$.next(token);
    });
  }

  getCallerLogin(identityNumber: string): Observable<Auth> {
    return this.httpClient.post<Auth>(this.ApiUrls.base + this.ApiUrls.login, {}, {
      params: { identityNumber }
    });
  }

  getCallerClsPnts(classs: string): Observable<number> {
    return this.httpClient.get<number>(this.ApiUrls.base + this.ApiUrls.classPoints, {
      params: { classs }
    });
  }

  getAuth(): Observable<Auth | null> {
    return this.authStore.getAuth();
  }

  setAuth(auth: Auth | null): void {
    this.authStore.setAuth(auth);
  }

  /** שומר טוקן בזיכרון וגם בלוקל סטורג' */
  setToken(tokenVal: string) {
    this._token$.next(tokenVal);
    localStorage.setItem('token', tokenVal);
  }

  /** שולף טוקן מה־BehaviorSubject */
  getToken(): Observable<string | null> {
    return this._token$.asObservable();
  }

  /** מחזיר את המשתמש */
  getUser(): Observable<User | null> {
    return this.authStore.getUser().pipe(tap(user => this._user$.next(user)));
  }

  getLoading(): Observable<boolean> {
    return this.authStore.getLoading();
  }

  setLoading(load: boolean): void {
    this.authStore.setLoading(load);
  }

  getClassPoints(): Observable<number | null> {
    return this.authStore.getClassPoints();
  }

  /** כניסה למערכת */
  login(): Observable<Auth | string> {
    let id: string = localStorage.getItem('id') ?? '';
    this.authStore.setLoading(true);
    return this.getCallerLogin(id
    ).pipe(
      tap((res: Auth) => {
        this.setToken(res.token);
        this.setAuth(res);
        this.classPoints(res.user.classs || '').subscribe();
        this.authStore.setLoading(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error fetching user info:', err);
        this.authStore.setAuth(null);
        this.authStore.setLoading(false);

        let message = 'שגיאת שרת';
        if (err.status === 403) message = 'המערכת סגורה לתלמידות בשעת שיעור';
        else if (err.status === 401) message = 'משתמש לא מורשה';

        return of(message);
      })
    );
  }

  classPoints(classs: string): Observable<number> {
    this.authStore.setLoading(true);
    return this.getCallerClsPnts(classs).pipe(
      tap((res: number) => {
        this.authStore.setClassPoints(res);
        this.authStore.setLoading(false);
      }),
      catchError((err: HttpErrorResponse) => {
        console.error('Error fetching class points', err);
        this.authStore.setLoading(false);
        return of(0);
      })
    );
  }

  /** יציאה מהמערכת */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');

    this._token$.next(null);
    this.authStore.logOut();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this._token$.pipe(map(token => !!token));
  }

  get userRole$(): Observable<string | null> {
    return this._role$.asObservable();
  }

  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  get token$(): Observable<string | null> {
    return this.authStore.getToken();
  }
}
