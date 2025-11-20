import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    const isAuthRequest = req.url.includes('/login') || req.url.includes('/register');

    let token = localStorage.getItem('token');
    let clonedRequest = req;

    if (token && !isAuthRequest) {
      clonedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    if (!isAuthRequest) {
      authService.setLoading(true);
    }

    return next.handle(clonedRequest).pipe(
      finalize(() => {
        if (!isAuthRequest) {
          authService.setLoading(false);
        }
      })
    );
  }
}
