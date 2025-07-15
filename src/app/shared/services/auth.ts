import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../core/model/model.ts';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Cookie } from './cookie';
import { environment } from '../../../environments/environment';
import { PermissionsService } from './permission.js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseURl = environment.baseUrl;
  private loginSubject = new Subject();
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  private cookieService = inject(Cookie);
  private permissionService = inject(PermissionsService);
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  handleToken(res: LoginResponse) {
    if (res.status === 'success') {
      if (res.token && res.token.access) {
        // Store JWT token in local storage or session storage
        this.cookieService.set(
          this.cookieService.COOKIE_NAME,
          res.token.access
        );
        this.cookieService.set('refreshToken', res.token.refresh);
        this.cookieService.set('user', JSON.stringify(res.data));
        this.permissionService.setPermissions(res.data.permissions);

        this.loginSubject.next(res);
        this.loginSubject.complete();
        this.router.navigate(['/main/dashboard']);
      }
    } else {
      this.loginSubject.error(res);
      const message: string = res.message || 'An Unknown error Occurred';
      // todo: leave a message to the user toastr
    }
  }

  setToken(token: string) {
    this.cookieService.set(this.cookieService.COOKIE_NAME, token);
  }

  refreshToken(refresh: string) {
    return this.http.post<{ access: string }>(
      `${this.baseURl}auth/v1/token/refresh/`,
      { refresh }
    );
  }

  login(loginRequest: LoginRequest) {
    this.http
      .post<LoginResponse>(`${this.baseURl}auth/v1/login/`, loginRequest)
      .subscribe({
        next: (res) => {
          // todo: leave a message to the user toastr
          this.handleToken(res);
          this.loginSubject.complete();
        },
        error: (err) => {
          this.loginSubject.error(err);
          // todo: leave a message to the user toastr
        },
      });

    return this.loginSubject.asObservable();
  }

  forgotPassword(forgotPasswordRequest: any) {
    return this.http.post('', forgotPasswordRequest);
  }

  getToken(): string | null {
    return this.cookieService.get(this.cookieService.COOKIE_NAME);
  }

  logout(): void {
    this.cookieService.clearAll();
    this.isAuthenticated.next(false);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserId(): string | null {
    return this.cookieService.get('userId');
  }

  private hasToken(): boolean {
    return !!this.cookieService?.get(this.cookieService.COOKIE_NAME);
  }
}
